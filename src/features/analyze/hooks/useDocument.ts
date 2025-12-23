import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useAuthContext } from "@/features/auth/components/AuthProvider";
import { DocumentRecord, DocumentRecordFirestore } from "@/types/firestore";

type DocumentSnapshot = Awaited<ReturnType<typeof getDoc>>;

function formatSnapshot(snapshot: DocumentSnapshot): DocumentRecord | null {
  if (!snapshot.exists()) {
    return null;
  }

  const rawData = snapshot.data() as DocumentRecordFirestore;

  // Transform Timestamp to String for UI
  const formattedData: DocumentRecord = {
    ...rawData,
    id: snapshot.id,
    createdAt: rawData.createdAt?.toDate().toISOString(),
    updatedAt: rawData.updatedAt?.toDate().toISOString(),
  };

  return formattedData;
}

export function useDocument(docId: string) {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const queryClient = useQueryClient();
  const [snapshotError, setSnapshotError] = useState<Error | null>(null);
  const userId = user?.uid;

  /**
   Only start fetching once there’s a logged-in user (!!user),
    the docId param exists (!!docId),
    and auth isn’t still determining the user (!isAuthLoading).
   */
  const isQueryEnabled = Boolean(userId && docId && !isAuthLoading);

  const query = useQuery({
    queryKey: ["analysis", userId, docId],
    queryFn: async () => {
      if (!userId) throw new Error("Not authenticated");

      const docRef = doc(db, "users", userId, "documents", docId);
      const snapshot = await getDoc(docRef);

      return formatSnapshot(snapshot);
    },
    staleTime: Infinity,
    enabled: isQueryEnabled,
    retry: (failureCount, err) => {
      // Avoid retrying when the user isn't authenticated.
      if (err instanceof Error && err.message === "Not authenticated")
        return false;
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (!isQueryEnabled || !userId) {
      setSnapshotError(null);
      return;
    }

    let isActive = true;

    const docRef = doc(db, "users", userId, "documents", docId);
    const queryKey = ["analysis", userId, docId];

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!isActive) return;
        setSnapshotError(null);

        const nextData = formatSnapshot(snapshot);
        queryClient.setQueryData(queryKey, nextData);

        if (nextData?.status === "completed") {
          unsubscribe();
        }
      },
      (error) => {
        if (!isActive) return;
        setSnapshotError(
          error instanceof Error
            ? error
            : new Error("Failed to listen for document updates")
        );
      }
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [docId, isQueryEnabled, queryClient, userId]);

  const error = snapshotError ?? query.error;
  const isError = Boolean(error);

  return { ...query, error, isError };
}
