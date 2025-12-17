import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/firebaseAdmin";
import type { DocumentRecord, DocumentRecordFirestore } from "@/types/firestore";
import { buildReportPdf } from "@/features/analyze/utils/buildReportPdf";

function getSafeFileName(fileName?: string) {
  const baseName = fileName?.replace(/\.[^/.]+$/, "") || "report";
  return baseName.replace(/[^a-zA-Z0-9-_]+/g, "_");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
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
    const { id } = await Promise.resolve(params);
    const docId = id?.trim();
    if (!docId) {
      return NextResponse.json({ error: "Missing report id" }, { status: 400 });
    }
    const docRef = db
      .collection("users")
      .doc(userId)
      .collection("documents")
      .doc(docId);

    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const rawData = snapshot.data() as DocumentRecordFirestore;
    if (rawData.status !== "completed" || !rawData.analysis) {
      return NextResponse.json(
        { error: "Report is not ready yet" },
        { status: 409 }
      );
    }

    const record: DocumentRecord = {
      ...rawData,
      id: snapshot.id,
      createdAt: rawData.createdAt?.toDate().toISOString(),
      updatedAt: rawData.updatedAt?.toDate().toISOString(),
    };

    const pdfBytes = await buildReportPdf({
      fileName: record.fileName,
      createdAt: record.createdAt,
      analysis: record.analysis,
    });

    const safeName = getSafeFileName(record.fileName);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}-report.pdf"`,
      },
    });
  } catch (error) {
    console.error("Report PDF route error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
