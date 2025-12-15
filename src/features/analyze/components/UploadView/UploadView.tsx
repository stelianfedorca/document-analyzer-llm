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
import { FilePreviewCard } from "../FilePreviewCard";

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
      <h1 className={styles.title}>Start a new analysis</h1>
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <AnimatePresence mode="wait" initial={false}>
            {file ? (
              <motion.div
                key="file-preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* <FilePreviewCard file={file} onRemove={handleRemoveFile} /> */}
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
        </div>

        <aside className={styles.sidebar}>
          <RecentAnalysisList />
        </aside>
      </div>
    </section>
  );
}
