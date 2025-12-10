"use client";

import { useMutation } from "@tanstack/react-query";
import { AnalysisReportResponse } from "../types";

export function useAnalyzeDocument() {
  async function analyzeDocument(file: File) {
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
    const { analysis } = await response.json();

    const parsedAnalysis = JSON.parse(analysis) as AnalysisReportResponse;

    return parsedAnalysis;
  }

  return useMutation({
    mutationFn: analyzeDocument,
    onSuccess: (data) => {
      console.log("success...: ", data);
    },
  });
}
