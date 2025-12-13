"use client";

import { AnalysisReportResponse } from "@/types/analysis";
import { useMutation } from "@tanstack/react-query";

export function useAnalyzeDocument() {
  async function analyzeDocument(file: File) {
    const start = performance.now();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Analysis failed");
    }

    // TODO: To make sure api returns unique id for each analysis report
    const { analysis } = (await response.json()) as {
      analysis: AnalysisReportResponse;
    };

    const end = performance.now();
    const ms = end - start;
    const seconds = (ms / 1000).toFixed(1);

    console.log(`analysis ready in: ${seconds}s`);

    console.log("analysis in custom hook: ", analysis);

    return analysis;
  }

  return useMutation({
    mutationFn: analyzeDocument,
    onSuccess: (data) => {
      console.log("success...: ", data);
    },
  });
}
