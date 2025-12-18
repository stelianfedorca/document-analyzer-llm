"use client";

import { useEffect, useRef, useState } from "react";
import { AnalysisReportLayout } from "../AnalysisReportLayout/AnalysisReportLayout";
import { ResultPanel } from "@/components/ResultPanel/ResultPanel";
import {
  FiBookmark,
  FiCheck,
  FiCopy,
  FiDownload,
  FiPlus,
} from "react-icons/fi";
import styles from "./AnalysisReportView.module.css";
import { DocumentRecord } from "@/types/firestore";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider/ToastProvider";
import {
  buildReportHtml,
  buildReportText,
} from "@/features/analyze/utils/buildReportText";

type Props = {
  document: DocumentRecord;
  onDownloadReport?: () => void;
  isDownloadingReport?: boolean;
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

export function AnalysisReportView({
  document,
  onDownloadReport,
  isDownloadingReport,
  onCopyReport,
  onSaveToHistory,
  onNewAnalysis,
}: Props) {
  const analysis = document?.analysis;
  const hasAnalysis = Boolean(analysis);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

  const status: Status = document?.status ?? "processing";

  const handleSaveToHistory = async () => {
    // if (!onSaveToHistory) return;
    // await Promise.resolve(onSaveToHistory());
    setIsSaved(true);
  };

  useEffect(() => {
    return () => {
      if (copyResetTimer.current) {
        clearTimeout(copyResetTimer.current);
      }
    };
  }, []);

  const markCopied = () => {
    setIsCopied(true);
    if (copyResetTimer.current) {
      clearTimeout(copyResetTimer.current);
    }
    copyResetTimer.current = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleCopyReport = async () => {
    if (!analysis) return;
    if (onCopyReport) {
      await Promise.resolve(onCopyReport());
      markCopied();
      return;
    }

    try {
      const reportText = buildReportText({
        fileName: document.fileName,
        createdAt: document.createdAt,
        analysis,
      });
      const reportHtml = buildReportHtml({
        fileName: document.fileName,
        createdAt: document.createdAt,
        analysis,
      });

      if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        const item = new ClipboardItem({
          "text/plain": new Blob([reportText], { type: "text/plain" }),
          "text/html": new Blob([reportHtml], { type: "text/html" }),
        });
        await navigator.clipboard.write([item]);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(reportText);
      } else {
        showToast({
          title: "Copy failed",
          description: "Clipboard access isn't available in this browser.",
          variant: "error",
        });
        return;
      }
      markCopied();
      showToast({
        title: "Report copied",
        description: "You can paste it anywhere.",
        variant: "success",
      });
    } catch (error) {
      showToast({
        title: "Copy failed",
        description: "Clipboard permissions may be blocked.",
        variant: "error",
      });
    }
  };

  return (
    <AnalysisReportLayout>
      <aside className={styles.sidebar}>
        <div className={styles.card}>
          <div className={styles.actions}>
            <Button
              icon={<FiDownload aria-hidden focusable="false" />}
              onClick={onDownloadReport}
              isLoading={isDownloadingReport}
              disabled={!hasAnalysis || isDownloadingReport}
            >
              Download Report
            </Button>

            <Button
              variant="secondary"
              icon={
                isCopied ? (
                  <FiCheck aria-hidden focusable="false" />
                ) : (
                  <FiCopy aria-hidden focusable="false" />
                )
              }
              onClick={handleCopyReport}
              disabled={!hasAnalysis}
            >
              {isCopied ? "Copied" : "Copy Report"}
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
    </AnalysisReportLayout>
  );
}
