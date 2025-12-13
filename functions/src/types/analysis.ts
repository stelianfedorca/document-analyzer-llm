import { z } from "zod";

export const AnalysisReportSchema = z.object({
  title: z.string().min(1),
  documentType: z.string().min(1),
  mainPoints: z.array(z.string().min(1)).min(1),
  overallSummary: z.array(z.string().min(1)).min(1).max(3),
});

export type AnalysisReportResponse = z.infer<typeof AnalysisReportSchema>;
