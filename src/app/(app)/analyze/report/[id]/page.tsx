"use client";

import { useDocument } from "@/features/analyze/hooks/useDocument";
import { ResultPanel } from "@/components/ResultPanel/ResultPanel";
import { useParams } from "next/navigation";
import { ReportView } from "@/features/analyze/components/ReportView";
import { AnalyzerClient } from "@/components/AnalyzerClient";

export default function ReportPage() {
  const params = useParams();
  const docId = params.id as string;

  const { data, isLoading, error } = useDocument(docId);

  // UI State Logic:
  // Show loading IF the hook is fetching initially OR if the document status is still "processing"
  const isProcessing = isLoading || data?.status === "processing";

  // Error Logic:
  // Show error IF the hook failed OR if the backend reported "failed"
  const displayError: Error | null = error
    ? (error as Error)
    : data?.status === "failed"
    ? new Error(data?.errorMessage || "Unknown analysis error")
    : null;

  return (
    <div className="container mx-auto py-8">
      {/* <AnalyzerClient /> */}
      <ReportView document={data} />
      {/* <ResultPanel
        data={data?.analysis}
        isLoading={isProcessing}
        error={displayError}
      /> */}
    </div>
  );
}
