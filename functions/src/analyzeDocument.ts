import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import type { DocumentRecord } from "./types/firestore";
import { db, storage } from "./firebase";
import { runGeminiAnalysis } from "./gemini";
import { FieldValue } from "firebase-admin/firestore";

export const analyzeDocument = onDocumentWritten(
  {
    document: "users/{userId}/documents/{docId}",
    secrets: ["GEMINI_API_KEY"],
    timeoutSeconds: 300,
    memory: "512MiB",
    region: "europe-west1",
  },
  async (event) => {
    // -------------------------------------------------------------------
    // 1. Snapshot Extraction: "Who were you?" vs "Who are you now?"
    // -------------------------------------------------------------------
    // State BEFORE the write
    const dataBeforeChange = event.data?.before.data() as
      | DocumentRecord
      | undefined;

    // State AFTER the write
    const dataAfterChange = event.data?.after.data() as
      | DocumentRecord
      | undefined;
    // -------------------------------------------------------------------
    // 2. Deletion Guard
    // If 'dataAfterChange' is undefined, it means the Doc was DELETED.
    // We can't analyze a ghost. Exit immediately.
    // -------------------------------------------------------------------
    if (!dataAfterChange) {
      logger.log("Document was deleted. Exiting...");
      return;
    }
    // -------------------------------------------------------------------
    // 3. Status Check (The "Target State")
    // We only care if the document currently needs work.
    // If it's "completed" or "failed", we shouldn't be here.
    // -------------------------------------------------------------------
    if (dataAfterChange.status !== "processing") {
      logger.log(
        `Document status is '${dataAfterChange.status}'. No analysis needed.`
      );
      return;
    }
    // -------------------------------------------------------------------
    // 4. Change Detection (The "Trigger Reason")
    // Why did this function wake up? Was it a VALID transition?
    // -------------------------------------------------------------------
    // Scenario A: Fresh Upload
    // The document didn't exist before this event.
    const isNewUpload = !dataBeforeChange;
    // Scenario B: Retry Button Clicked
    // The document existed, BUT the status wasn't 'processing' before.
    // (e.g., it was 'failed' and the user clicked Retry)
    const isRetryAction =
      dataBeforeChange && dataBeforeChange.status !== "processing";
    // -------------------------------------------------------------------
    // 5. The "Infinite Loop" Guard
    // If neither A nor B is true, it means the status was ALREADY 'processing'
    // before this write happened.
    //
    // This happens if:
    // - The function itself is running and updating a timestamp.
    // - Another process touched the doc while it was processing.
    // -------------------------------------------------------------------
    if (!isNewUpload && !isRetryAction) {
      logger.log("Document was already processing. Preventing infinite loop.");
      return;
    }
    // -------------------------------------------------------------------
    // 6. Safe Zone: Start The Heavy Work
    // If we passed all checks, we are legitimately supposed to run.
    // -------------------------------------------------------------------
    logger.info(`Starting Analysis for Doc ID: ${event.params.docId}`);

    const { docId, userId } = event.params;
    const { storagePath, fileName } = dataAfterChange;

    try {
      // Step A: Fetch File from Storage
      const bucket = storage.bucket();
      const fileRef = bucket.file(storagePath);
      const [buffer] = await fileRef.download();
      const base64Data = buffer.toString("base64");

      const mimeType = fileName.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "text/plain";

      // Step B: Send to Gemini

      const analysisResult = await runGeminiAnalysis(base64Data, mimeType);
      // Step C: Update Document with Results
      // (This update will trigger the function again, but Step 3 will catch it!)
      await db
        .collection("users")
        .doc(userId)
        .collection("documents")
        .doc(docId)
        .update({
          status: "completed",
          analysis: analysisResult,
          updatedAt: FieldValue.serverTimestamp(),
        });

      logger.info(`Success: ${docId}`);
    } catch (error) {
      logger.error("Analysis Failed", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      await db
        .collection("users")
        .doc(userId)
        .collection("documents")
        .doc(docId)
        .update({
          status: "failed",
          errorMessage,
          updatedAt: FieldValue.serverTimestamp(),
        });
    }
  }
);
