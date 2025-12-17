"use client";

import styles from "./AnalysisStatusCard.module.css";
import { useState, useEffect } from "react";
import { FiFileText, FiStar } from "react-icons/fi";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AnalysisStatusCardError,
  AnalysisStatusCardErrorProps,
} from "./AnalysisStatusCardError";

const PROCESS_STEPS = [
  "Uploading document…",
  "Reading content…",
  "Extracting insights…",
  "Finishing up…",
];

interface Props extends AnalysisStatusCardErrorProps {
  variant: "processing" | "error";
  fileName?: string;
}

const variants = {
  initial: { opacity: 0, y: 6, filter: "blur(2px" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(2px)" },
};

export function AnalysisStatusCard({
  variant,
  fileName,
  ...errorProps
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const step =
    PROCESS_STEPS[stepIndex] ?? PROCESS_STEPS[PROCESS_STEPS.length - 1];

  useEffect(() => {
    if (variant === "error") return;

    setStepIndex(0);

    const timers: Array<ReturnType<typeof setTimeout>> = [];

    PROCESS_STEPS.slice(1).forEach((_, idx) => {
      const timer = setTimeout(() => {
        setStepIndex((current) => Math.min(current + 1, idx + 1));
      }, (idx + 1) * 2500);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [variant]);

  if (variant === "error") {
    return <AnalysisStatusCardError {...errorProps} />;
  }

  // Processing Variant
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Document Analysis in Progress</h1>
        <p className={styles.message}>
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
              className={styles.step}
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
