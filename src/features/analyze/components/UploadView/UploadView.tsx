"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./UploadView.module.css";
import { FilePreviewCard } from "@/features/analyze/components/FilePreviewCard";
import { useAnalyzeDocument } from "@/features/analyze/hooks";
import { useRouter } from "next/navigation";
import { DropZone } from "../DropZone";

export function UploadView() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleAnalyzeDocument = async () => {
    // if (!file || isPending) return;

    // await mutateAsync(file);

    router.push("/analyze/report/123");
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Start a new analysis</h1>

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FilePreviewCard file={file} onRemove={handleRemoveFile} />
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

      <button onClick={handleAnalyzeDocument}>Analyze button</button>
    </section>
  );
}
