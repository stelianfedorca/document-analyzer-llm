import { auth, db, storage } from "@/lib/firebaseAdmin";
import { checkRateLimit } from "@/lib/rateLimit";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate User
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch {
      return NextResponse.json(
        { error: "Invalid authorization token" },
        { status: 401 }
      );
    }
    const userId = decodedToken.uid;

    // 2. Check Rate Limit
    const rateCheck = await checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again tomorrow.",
          remaining: 0,
          resetAt: rateCheck.resetAt.toISOString(),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateCheck.resetAt.getTime() - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // 3. Parse Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Generate IDs and Paths
    const docId = crypto.randomUUID();
    const extension = file.name.split(".").pop();
    const storagePath = `uploads/${userId}/${docId}.${extension}`;

    // 4. Upload to Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = storage.bucket();
    const fileRef = bucket.file(storagePath);

    await fileRef.save(buffer, {
      contentType: file.type,
      metadata: {
        originalName: file.name,
        userId: userId,
      },
    });

    // 5. Create Firestore Document (Trigger Cloud Function)
    await db
      .collection("users")
      .doc(userId)
      .collection("documents")
      .doc(docId)
      .set({
        fileName: file.name,
        storagePath: storagePath,
        status: "processing",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

    return NextResponse.json({
      success: true,
      docId,
      message: "File uploaded and processing started",
    });
  } catch (error: any) {
    console.error("Analysis route error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
