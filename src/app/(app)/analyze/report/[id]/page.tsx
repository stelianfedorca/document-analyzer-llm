"use client";

import { useDocument } from "@/features/analyze/hooks/useDocument";
import { ResultPanel } from "@/components/ResultPanel/ResultPanel";
import { useParams } from "next/navigation";
import { ReportView } from "@/features/analyze/components/ReportView";
import { AnalyzerClient } from "@/components/AnalyzerClient";
import { AnalysisStatusCard } from "@/features/analyze/components/AnalysisStatusCard/AnalysisStatusCard";

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

  if (true) {
    return <AnalysisStatusCard mode="processing" />;
  }

  if (displayError) {
    return (
      <AnalysisStatusCard
        mode="error"
        errorMessage={displayError.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return <ReportView document={data} />;
}
