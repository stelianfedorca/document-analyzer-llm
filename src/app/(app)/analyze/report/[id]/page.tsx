"use client";

import { useDocument } from "@/features/analyze/hooks/useDocument";
import { useParams } from "next/navigation";
import { ReportView } from "@/features/analyze/components/ReportView";
import { AnalysisStatusCard } from "@/features/analyze/components/AnalysisStatusCard/AnalysisStatusCard";

export default function ReportPage() {
  const params = useParams();
  const docId = params.id as string;

  const { data, isLoading, error } = useDocument(docId);

  // mock
  // const isLoading = false;
  // const data = { status: "failed", errorMessage: "" };
  // const error = null;

  // UI State Logic:
  // On refresh, the query can be temporarily "idle" (enabled=false while auth/hydration settles),
  // which yields: isLoading=false, data=undefined, error=null. Treat that as pending.
  const isPending = isLoading || (data === undefined && !error);

  // Show processing while pending OR while backend status is still "processing"
  const isProcessing = isPending || data?.status === "processing";

  // Error Logic:
  // Show error IF the hook failed OR if the backend reported "failed"
  const displayError: Error | null = error
    ? (error as Error)
    : data?.status === "failed"
    ? new Error(data?.errorMessage || "Unknown analysis error")
    : null;

  if (isProcessing) {
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

  if (data === null) {
    return (
      <AnalysisStatusCard
        mode="error"
        errorMessage="We couldn't find this document. It may have been deleted or never created."
      />
    );
  }

  if (data === undefined) {
    return <AnalysisStatusCard mode="processing" />;
  }

  return <ReportView document={data} />;
}
