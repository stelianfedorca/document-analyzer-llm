"use client";

import { useAuthContext } from "@/features/auth/components/AuthProvider";
import { useMutation } from "@tanstack/react-query";

export function useAnalyzeDocument() {
  const { user, isLoading } = useAuthContext();
  console.log("user: ", user?.uid);

  async function analyzeDocument(file: File) {
    if (isLoading) throw new Error("Still determining auth state");
    if (!user) throw new Error("You must be signed in to analyze a document");

    // get a firebase id token based on the uid
    const idToken = await user.getIdToken();

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
      if (response.status === 429) {
        throw new Error(
          errorData.error ||
            "Rate limit exceeded. Please try again later tomorrow."
        );
      }
      throw new Error(errorData.error || "Analysis failed");
    }

    const { docId } = (await response.json()) as {
      docId: string;
    };

    return docId;
  }

  return useMutation({
    mutationFn: analyzeDocument,
  });
}
