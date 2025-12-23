import { auth, db } from "@/lib/firebaseAdmin";
import { DocumentRecordFirestore } from "@/types/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
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
    const { docId } = await req.json();

    if (!docId) {
      return NextResponse.json(
        {
          error: "Missing document id",
        },
        { status: 400 }
      );
    }

    const docRef = db
      .collection("users")
      .doc(userId)
      .collection("documents")
      .doc(docId);

    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const doc = docSnapshot.data() as DocumentRecordFirestore;

    if (doc.status !== "failed") {
      return NextResponse.json(
        { error: "Document is not in failed state" },
        { status: 409 }
      );
    }

    await docRef.update({
      status: "processing",
      errorMessage: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Retry succeeded",
      docId,
    });
  } catch (error) {
    console.error("Retry analysis route error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
