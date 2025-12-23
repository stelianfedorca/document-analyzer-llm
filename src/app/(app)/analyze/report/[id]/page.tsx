"use client";

import { useDocument } from "@/features/analyze/hooks/useDocument";
import { useDownloadReport } from "@/features/analyze/hooks/useDownloadReport";
import { useParams } from "next/navigation";
import { AnalysisReportView } from "@/features/analyze/components/AnalysisReportView";
import { AnalysisStatusCard } from "@/features/analyze/components/AnalysisStatusCard/AnalysisStatusCard";
import { useRetryAnalyzeDocument } from "@/features/analyze/hooks/useRetryAnalyzeDocument";
import { useToast } from "@/components/ui/ToastProvider/ToastProvider";

export default function ReportPage() {
  const params = useParams();
  const docId = params.id as string;

  const { data, isLoading, error } = useDocument(docId);
  const downloadReport = useDownloadReport({
    docId,
    fileName: data?.fileName,
  });
  const retry = useRetryAnalyzeDocument();
  const { showToast } = useToast();

  // mock
  // const isLoading = false;
  // const data = { status: "failed", errorMessage: "" };
  // const error = null;

  // UI State Logic:
  // On refresh, the query can be temporarily "idle" (enabled=false while auth/hydration settles),
  // which yields: isLoading=false, data=undefined, error=null. Treat that as pending.
  const isPending = isLoading || (data === undefined && !error);

  // Show processing while pending OR while backend status is still "processing"
  const isProcessing =
    isPending || data?.status === "processing" || retry.isPending;

  // Error Logic:
  // Show error IF the hook failed OR if the backend reported "failed"
  const displayError: Error | null = error
    ? (error as Error)
    : data?.status === "failed"
    ? new Error(data?.errorMessage || "Unknown analysis error")
    : null;

  // const displayError = new Error("hello world");

  if (isProcessing) {
    return <AnalysisStatusCard variant="processing" />;
  }

  if (displayError) {
    return (
      <AnalysisStatusCard
        variant="error"
        errorMessage={displayError.message}
        onRetry={() => {
          if (retry.isPending) return;
          retry.mutate(
            { docId },
            {
              onError: (err) => {
                const message =
                  err instanceof Error ? err.message : "Retry failed";
                showToast({
                  title: "Retry failed",
                  description: message,
                  variant: "error",
                });
              },
            }
          );
        }}
      />
    );
  }

  if (data === null) {
    return (
      <AnalysisStatusCard
        variant="error"
        errorMessage="We couldn't find this document. It may have been deleted or never created."
      />
    );
  }

  if (data === undefined) {
    return <AnalysisStatusCard variant="processing" />;
  }

  return (
    <AnalysisReportView
      document={data}
      onDownloadReport={() => downloadReport.mutate()}
      isDownloadingReport={downloadReport.isPending}
    />
  );
}
