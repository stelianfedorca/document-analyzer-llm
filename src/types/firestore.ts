export type AnalysisStatus = "processing" | "completed" | "failed";

export interface AnalysisData {
  title: string;
  documentType: string;
  mainPoints: string[];
  overallSummary: string[];
}

export interface DocumentAnalysis {
  fileName: string;
  storagePath: string;
  status: AnalysisStatus;

  analysis?: AnalysisData;

  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
