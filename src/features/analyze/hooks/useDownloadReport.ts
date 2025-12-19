"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/features/auth/components/AuthProvider";

type Props = {
  docId: string;
  fileName?: string;
};

/**
 * Extracts filename from Content-Disposition header.
 */
function extractFilenameFromContentDisposition(
  contentDisposition: string | null
): string | null {
  if (!contentDisposition) return null;

  // Try RFC 5987 format first: filename*=UTF-8''encoded-name
  const rfc5987Match = contentDisposition.match(
    /filename\*=UTF-8''(.+?)(?:;|$)/i
  );
  if (rfc5987Match) {
    try {
      return decodeURIComponent(rfc5987Match[1]);
    } catch {
      // If decoding fails, fall through to standard format
    }
  }

  // Try standard format: filename="name" or filename=name
  const standardMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (standardMatch) {
    // Remove quotes if present and trim
    return standardMatch[1].replace(/^"|"$/g, "").trim();
  }

  return null;
}

export function useDownloadReport({ docId, fileName }: Props) {
  const { user, isLoading: isAuthLoading } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      if (isAuthLoading) {
        throw new Error("Still determining auth state");
      }
      if (!user) {
        throw new Error("You must be signed in to download a report");
      }
      if (!docId) {
        throw new Error("Missing report id");
      }

      const token = await user.getIdToken();
      const response = await fetch(`/api/report/${docId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let message = "Failed to download report.";
        try {
          const errorData = (await response.json()) as { error?: string };
          if (errorData?.error) message = errorData.error;
        } catch {}
        throw new Error(message);
      }

      // Extract filename from server's Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename =
        extractFilenameFromContentDisposition(contentDisposition) ||
        fileName ||
        "report.pdf";

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      window.URL.revokeObjectURL(url);
    },
  });
}
