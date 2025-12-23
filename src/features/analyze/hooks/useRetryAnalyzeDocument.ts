import { useAuthContext } from "@/features/auth/components/AuthProvider";
import { DocumentRecord } from "@/types/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RetryVariables = {
  docId: string;
};

export function useRetryAnalyzeDocument() {
  const { user, isLoading } = useAuthContext();
  const queryClient = useQueryClient();
  const userId = user?.uid;

  return useMutation({
    mutationFn: async ({ docId }: RetryVariables) => {
      if (isLoading) throw new Error("Still determining auth state");
      if (!user) throw new Error("You must be signed in to analyze a document");

      const token = await user.getIdToken();

      const response = await fetch("/api/analyze/retry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ docId }),
      });

      if (!response.ok) {
        let errorMessage = "Retry failed";

        try {
          const { error } = await response.json();
          if (error) errorMessage = error;
        } catch {}

        throw new Error(errorMessage);
      }

      return docId;
    },
    // 1. Called BEFORE mutationFn runs
    onMutate: async ({ docId }: RetryVariables) => {
      // Cancel any outgoing queries so they don't overwrite our optimistic update
      const queryKey = ["analysis", userId, docId];
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value (for rollback)
      const previousData = queryClient.getQueryData<DocumentRecord>(queryKey);

      // Optimistically update to "processing"
      if (previousData) {
        queryClient.setQueryData(queryKey, {
          ...previousData,
          status: "processing",
          errorMessage: undefined, // Clear the error
        });
      }
      // Return the snapshot to use in onError for rollback
      return { previousData, queryKey };
    },

    // 2. Called if the mutation fails
    onError: (err, variables, context) => {
      // Rollback to the previous data
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },

    onSettled: (_data, _err, { docId }) => {
      queryClient.invalidateQueries({
        queryKey: ["analysis", userId, docId],
      });
    },
  });
}
