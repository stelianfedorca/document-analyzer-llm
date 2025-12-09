"use client";

import { useState } from "react";
import AnalyzerLayout from "./AnalyzerLayout";
import { ResultPanel } from "./ResultPanel/ResultPanel";
import { UploadPanel } from "./UploadPanel/UploadPanel";
import { useMutation } from "@tanstack/react-query";
import { AnalysisReportResponse } from "@/features/analyze/types";
import { useAnalyzeDocument } from "@/features/analyze/hooks/useAnalyzeDocument";

export function AnalyzerClient() {
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync, isPending, error, data } = useAnalyzeDocument();

  const handleAnalyzeDocument = async (file: File) => {
    await mutateAsync(file);
  };

  return (
    <AnalyzerLayout>
      <UploadPanel
        file={file}
        onFileSelect={setFile}
        onAnalyze={handleAnalyzeDocument}
        isAnalyzing={isPending}
      />
      <ResultPanel data={data} isLoading={isPending} error={error} />
    </AnalyzerLayout>
  );
}
