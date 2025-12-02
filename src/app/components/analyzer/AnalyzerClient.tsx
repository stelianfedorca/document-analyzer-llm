"use client";

import { useState } from "react";
import AnalyzerLayout from "./AnalyzerLayout";
import { ResultPanel } from "./ResultPanel/ResultPanel";
import { UploadPanel } from "./UploadPanel/UploadPanel";
import { useMutation } from "@tanstack/react-query";

export function AnalyzerClient() {
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async (fileToAnalyze: File) => {
      const formData = new FormData();
      formData.append("file", fileToAnalyze);
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      return response.json();
    },
  });

  const handleAnalyzeDocument = async (file: File) => {
    await mutation.mutateAsync(file);
  };

  return (
    <AnalyzerLayout>
      <UploadPanel
        file={file}
        onFileSelect={setFile}
        onAnalyze={handleAnalyzeDocument}
        isAnalyzing={mutation.isPending}
      />
      <ResultPanel
        results={mutation.data}
        isLoading={mutation.isPending}
        error={mutation.error}
      />
    </AnalyzerLayout>
  );
}
