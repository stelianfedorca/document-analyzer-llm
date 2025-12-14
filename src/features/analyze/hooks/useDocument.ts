import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useAuthContext } from "@/features/auth/components/AuthProvider";
import { DocumentRecord, DocumentRecordFirestore } from "@/types/firestore";

export function useDocument(docId: string) {
  const { user, isLoading: isAuthLoading } = useAuthContext();

  /**
   Only start fetching once there’s a logged-in user (!!user),
    the docId param exists (!!docId),
    and auth isn’t still determining the user (!isAuthLoading).
   */
  const isQueryEnabled = Boolean(user && docId && !isAuthLoading);

  return useQuery({
    queryKey: ["analysis", docId],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const docRef = doc(db, "users", user.uid, "documents", docId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new Error("Document not found");
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
    },
    enabled: isQueryEnabled,
    // SMART POLLING:
    // If we are "processing", refetch every 1000ms.
    // Otherwise (completed/failed), stop polling (false).
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "processing" ? 1000 : false;
    },
  });
}
