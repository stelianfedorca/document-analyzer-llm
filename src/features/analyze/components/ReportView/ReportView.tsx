"use client";

import { useState } from "react";
import AnalyzerLayout from "@/components/AnalyzerLayout";
import { ResultPanel } from "@/components/ResultPanel/ResultPanel";
import {
  FiBookmark,
  FiCopy,
  FiDownload,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import styles from "./ReportView.module.css";
import { DocumentRecord } from "@/types/firestore";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type Props = {
  document: DocumentRecord;
  onDownloadReport?: () => void;
  onCopyReport?: () => void;
  onSaveToHistory?: () => void;
  onNewAnalysis?: () => void;
};

type Status = DocumentRecord["status"];

const statusClassMap: Record<Status, string> = {
  processing: styles.statusProcessing,
  completed: styles.statusCompleted,
  failed: styles.statusFailed,
};

const statusLabelMap: Record<Status, string> = {
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

export function ReportView({
  document,
  onDownloadReport,
  onCopyReport,
  onSaveToHistory,
  onNewAnalysis,
}: Props) {
  const analysis = document?.analysis;
  const hasAnalysis = Boolean(analysis);
  const [isSaved, setIsSaved] = useState(false);

  const formattedDate = document?.createdAt
    ? new Date(document.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  const docTypeLabel = analysis?.documentType
    ? analysis.documentType.charAt(0).toUpperCase() +
      analysis.documentType.slice(1)
    : undefined;

  const status: Status = document?.status ?? "processing";

  const handleSaveToHistory = async () => {
    // if (!onSaveToHistory) return;
    // await Promise.resolve(onSaveToHistory());
    setIsSaved(true);
  };

  return (
    <AnalyzerLayout>
      <aside className={styles.sidebar}>
        <div className={styles.card}>
          <div className={styles.actions}>
            <Button
              icon={<FiDownload aria-hidden focusable="false" />}
              onClick={onDownloadReport}
            >
              Download Report
            </Button>

            <Button
              variant="secondary"
              icon={<FiCopy aria-hidden focusable="false" />}
              onClick={onCopyReport}
              disabled={!hasAnalysis}
            >
              Copy Report
            </Button>

            <Button
              variant="ghost"
              icon={
                isSaved ? (
                  <FiBookmark
                    aria-hidden
                    focusable="false"
                    fill="currentColor"
                  />
                ) : (
                  <FiBookmark aria-hidden focusable="false" />
                )
              }
              onClick={handleSaveToHistory}
              disabled={!hasAnalysis}
              state={isSaved ? "saved" : undefined}
            >
              {isSaved ? "Saved" : "Save to History"}
            </Button>
          </div>

          <Link href="/analyze/upload" className={styles.linkAction}>
            <FiPlus aria-hidden focusable="false" />
            New Analysis
          </Link>
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <ResultPanel data={document} />
      </div>
    </AnalyzerLayout>
  );
}
