"use client";

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

type Props = {
  document?: DocumentRecord;
  onDownload?: () => void;
  onCopySummary?: () => void;
  onSaveToHistory?: () => void;
  onNewAnalysis?: () => void;
};

const noop = () => {};

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
  onDownload,
  onCopySummary,
  onSaveToHistory,
  onNewAnalysis,
}: Props) {
  const analysis = document?.analysis;
  const hasAnalysis = Boolean(analysis);

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

  return (
    <AnalyzerLayout>
      <aside className={styles.sidebar}>
        <div className={styles.card}>
          <p className={styles.kicker}>Report overview</p>
          <h1 className={styles.heading}>
            {analysis?.title ?? "Analysis in progress"}
          </h1>

          <div className={styles.fileMeta}>
            <div className={styles.fileIcon}>
              <FiFileText aria-hidden />
            </div>
            <div>
              <p className={styles.fileName}>
                {document?.fileName ?? "Unnamed document"}
              </p>
              {formattedDate && <p className={styles.meta}>{formattedDate}</p>}
            </div>
          </div>

          <div className={styles.statusRow}>
            <span className={`${styles.statusBadge} ${statusClassMap[status]}`}>
              {statusLabelMap[status]}
            </span>
            {docTypeLabel && <span className={styles.tag}>{docTypeLabel}</span>}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={onDownload}
              disabled={!hasAnalysis}
            >
              <FiDownload aria-hidden />
              Download Report
            </button>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={onCopySummary}
              disabled={!hasAnalysis}
            >
              <FiCopy aria-hidden />
              Copy Summary
            </button>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={onSaveToHistory}
              disabled={!hasAnalysis}
            >
              <FiBookmark aria-hidden />
              Save to history
            </button>
          </div>

          <button
            type="button"
            className={styles.linkAction}
            onClick={onNewAnalysis}
          >
            <FiPlus aria-hidden />
            New Analysis
          </button>
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <ResultPanel data={analysis} isLoading={false} error={null} />
      </div>
    </AnalyzerLayout>
  );
}
