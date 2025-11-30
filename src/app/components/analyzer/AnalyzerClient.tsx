"use client";

import AnalyzerLayout from "./AnalyzerLayout";
import { ResultPanel } from "./ResultPanel/ResultPanel";
import { UploadPanel } from "./UploadPanel/UploadPanel";

export function AnalyzerClient() {
  return (
    <AnalyzerLayout>
      <UploadPanel />
      <ResultPanel />
    </AnalyzerLayout>
  );
}
