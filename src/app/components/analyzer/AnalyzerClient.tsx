"use client";

import { useState } from "react";
import AnalyzerLayout from "./AnalyzerLayout";
import { ResultPanel } from "./ResultPanel/ResultPanel";
import { UploadPanel } from "./UploadPanel/UploadPanel";

export function AnalyzerClient() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <AnalyzerLayout>
      <UploadPanel file={file} onFileSelect={setFile} />
      <ResultPanel />
    </AnalyzerLayout>
  );
}
