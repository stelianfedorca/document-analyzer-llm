"use client";

import styles from "./AnalysisStatusCard.module.css";
import { useState, useEffect } from "react";
import { FiAlertTriangle, FiFileText, FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  Variants,
} from "framer-motion";

const PROCESS_STEPS = [
  "Uploading document…",
  "Reading content…",
  "Extracting insights…",
  "Finishing up…",
];

interface Props {
  mode: "processing" | "error";
  errorMessage?: string;
  onRetry?: () => void;
  onCancel?: () => void;
  fileName?: string;
}

const variants = {
  initial: { opacity: 0, y: 6, filter: "blur(2px" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(2px)" },
};

export function AnalysisStatusCard({
  mode,
  errorMessage = "Something went wrong during analysis.",
  onRetry,
  onCancel,
  fileName,
}: Props) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const step =
    PROCESS_STEPS[stepIndex] ?? PROCESS_STEPS[PROCESS_STEPS.length - 1];

  useEffect(() => {
    if (mode !== "processing") return;

    setStepIndex(0);

    const timers: Array<ReturnType<typeof setTimeout>> = [];

    PROCESS_STEPS.slice(1).forEach((_, idx) => {
      const timer = setTimeout(() => {
        setStepIndex((current) => Math.min(current + 1, idx + 1));
      }, (idx + 1) * 2500);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [mode]);

  // Handle Cancel (e.g. go back to dashboard)
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    router.push("/analyze/upload"); // Redirect to analyze/upload page
  };

  if (mode === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.errorIconWrapper}>
            <FiAlertTriangle />
          </div>
          <h1 className={styles.title}>Analysis Failed</h1>
          <p className={styles.subtitle}>{errorMessage}</p>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <button className={styles.cancelButton} onClick={handleCancel}>
              Go Back
            </button>
            {onRetry && (
              <button className={styles.retryButton} onClick={onRetry}>
                Retry Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Processing Mode
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Document Analysis in Progress</h1>
        <p className={styles.subtitle}>
          {fileName
            ? `Processing ${fileName}`
            : "Processing your document for key insights."}
        </p>

        {/* Scanning */}
        <div className={styles.spinnerWrapper}>
          <div className={styles.scanner} aria-hidden="true">
            <div className={styles.document}>
              <FiFileText className={styles.documentIcon} />
            </div>
            <FiStar className={`${styles.sparkle} ${styles.sparkle1}`} />
            <FiStar className={`${styles.sparkle} ${styles.sparkle2}`} />
            <FiStar className={`${styles.sparkle} ${styles.sparkle3}`} />
          </div>
          {/* initial={false} prevents the step text from animating in on page load */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={step}
              className={styles.spinnerText}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.22 }
              }
              aria-live="polite"
              aria-atomic="true"
            >
              {step}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
