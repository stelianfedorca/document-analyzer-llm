"use client";

import { useRouter } from "next/navigation";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import layoutStyles from "./AnalysisStatusCard.module.css";
import styles from "./AnalysisStatusCardError.module.css";

export interface AnalysisStatusCardErrorProps {
  errorMessage?: string;
  errorDetail?: string;
  errorDetailActionLabel?: string;
  errorFootnote?: string;
  onErrorDetail?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function AnalysisStatusCardError({
  errorMessage = "We couldn't process your document. Please try again or cancel.",
  errorDetail,
  errorDetailActionLabel = "More info",
  errorFootnote = "If the problem persists, contact support.",
  onErrorDetail,
  onRetry,
  onCancel,
}: AnalysisStatusCardErrorProps) {
  const router = useRouter();
  const showDetailRow = Boolean(errorDetail || onErrorDetail);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    router.push("/analyze/upload");
  };

  return (
    <div className={layoutStyles.wrapper}>
      <div className={`${layoutStyles.card} ${styles.card}`}>
        <header className={styles.header}>
          <span className={styles.statusIcon}>
            <IoCloseCircleOutline />
          </span>
          <h1 className={layoutStyles.title}>Analysis Failed</h1>
        </header>
        <p className={`${layoutStyles.message} ${styles.message}`}>
          {errorMessage}
        </p>

        {showDetailRow && (
          <div className={styles.detailRow}>
            {errorDetail && (
              <span className={styles.detailText}>{errorDetail}</span>
            )}
            {errorDetail && onErrorDetail && (
              <span className={styles.detailDivider} aria-hidden="true">
                —
              </span>
            )}
            {onErrorDetail && (
              <button
                type="button"
                className={styles.detailAction}
                onClick={onErrorDetail}
              >
                {errorDetailActionLabel}
              </button>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <Button
            variant="ghost"
            className={styles.actionSecondary}
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </Button>
          {onRetry && (
            <Button
              className={styles.actionPrimary}
              onClick={onRetry}
              type="button"
            >
              Retry
            </Button>
          )}
        </div>

        {errorFootnote && (
          <p className={styles.footnote}>{errorFootnote}</p>
        )}
      </div>
    </div>
  );
}
