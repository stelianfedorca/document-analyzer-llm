"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./UploadView.module.css";
import { PreviewCard } from "@/features/analyze/components/PreviewCard";
import { useAnalyzeDocument } from "@/features/analyze/hooks";
import { useRouter } from "next/navigation";
import { DropZone } from "../DropZone";
import { RecentAnalysisList } from "@/features/history/components/RecentAnalysisList";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider/ToastProvider";

export function UploadView() {
  const [file, setFile] = useState<File | null>(null);
  const isCtaDisabled = file === null;
  const router = useRouter();
  const { mutateAsync, isPending } = useAnalyzeDocument();
  const { showToast } = useToast();

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleChangeFile = () => {
    setFile(null);
  };

  const handleAnalyzeDocument = async () => {
    if (!file || isPending) return;
    try {
      // Store the start time for the analysis to measure perceived UX duration
      localStorage.setItem(`analysis_start`, Date.now().toString());
      const docId = await mutateAsync(file);
      router.push(`/analyze/report/${docId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Please try again later";
      console.error("Failed to analyze document:", errorMessage);

      showToast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "error",
      });
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Document Analyzer</p>
          <h1 className={styles.title}>Start a new analysis</h1>
          <p className={styles.subtitle}>
            Upload a file to generate a structured report you can review
          </p>
          {/* <div className={styles.chipRow}>
            <span className={styles.chip}>PDF</span>
            <span className={styles.chip}>DOCX</span>
            <span className={styles.chip}>TXT</span>
          </div> */}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <motion.div layout className={styles.uploadCard}>
            <div className={styles.uploadSurface}>
              <AnimatePresence mode="wait" initial={false}>
                {file ? (
                  <motion.div
                    key="file-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PreviewCard
                      file={file}
                      onRemove={handleRemoveFile}
                      onChangeFile={handleChangeFile}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="drop-zone"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropZone onFileSelected={setFile} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={styles.ctaRow}>
              <Button
                variant="primary"
                size="md"
                onClick={handleAnalyzeDocument}
                className={styles.analyzeButton}
                disabled={isCtaDisabled}
                isLoading={isPending}
              >
                Analyze Document
              </Button>
              <p className={styles.ctaHint}>
                We will take you to the report view when it is ready.
              </p>
            </div>
          </motion.div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Recent analyses</h2>
              <p className={styles.sidebarSubtitle}>
                Track your latest reports in one place.
              </p>
            </div>
            <RecentAnalysisList />
          </div>
        </aside>
      </div>
    </section>
  );
}
