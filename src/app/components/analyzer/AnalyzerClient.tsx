"use client";

import { useState } from "react";
import AnalyzerLayout from "./AnalyzerLayout";
import { ResultPanel } from "./ResultPanel/ResultPanel";
import { UploadPanel } from "./UploadPanel/UploadPanel";

export function AnalyzerClient() {
  const [file, setFile] = useState<File | null>(null);

  const handleAnalyzeDocument = async (file: File) => {
    console.log("handleAnalyzeDocument() called...");
  };

  return (
    <AnalyzerLayout>
      <UploadPanel
        file={file}
        onFileSelect={setFile}
        onAnalyze={handleAnalyzeDocument}
      />
      <ResultPanel />
    </AnalyzerLayout>
  );
}
