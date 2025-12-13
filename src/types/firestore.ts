import { Timestamp } from "firebase-admin/firestore";

export type AnalysisStatus = "processing" | "completed" | "failed";

export interface AnalysisData {
  title: string;
  documentType: string;
  mainPoints: string[];
  overallSummary: string[];
}

interface DocumentAnalysisBase {
  fileName: string;
  storagePath: string;
  status: "processing" | "completed" | "failed";
  analysis?: AnalysisData;
  errorMessage?: string;
}

// Database Type (What you get from Firestore and send to Firebase)
export interface DocumentAnalysisFirestore extends DocumentAnalysisBase {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// UI / Response shape for a analysis record from firestore
export interface DocumentAnalysis extends DocumentAnalysisBase {
  id: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}
