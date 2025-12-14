"use client";

import { useAuthContext } from "@/features/auth/components/AuthProvider";
import { AnalysisReportResponse } from "@/types/analysis";
import { useMutation } from "@tanstack/react-query";

export function useAnalyzeDocument() {
  const { user, isLoading } = useAuthContext();

  async function analyzeDocument(file: File) {
    if (isLoading) throw new Error("Still determining auth state");
    if (!user) throw new Error("You must be signed in to analyze a document");

    const idToken = await user.getIdToken();

    const start = performance.now();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
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
