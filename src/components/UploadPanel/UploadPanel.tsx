"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";
import styles from "./UploadPanel.module.css";
import { FilePreviewCard } from "../../features/analyze/components/FilePreviewCard/FilePreviewCard";

interface Props {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onAnalyze: (file: File) => Promise<void>;
  isAnalyzing?: boolean;
}

export function UploadPanel({
  file,
  onFileSelect,
  onAnalyze,
  isAnalyzing = false,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      onFileSelect(droppedFiles[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
  };

  return (
    <section className={styles.container} aria-labelledby="upload-heading">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="drop-zone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`${styles.uploadArea} ${
              isDragging ? styles.active : ""
            }`}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className={styles.input}
              onChange={handleFileChange}
            />

            <label
              htmlFor="file-input"
              className={styles.dropArea}
              role="button"
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <motion.div
                className={styles.iconWrap}
                animate={{
                  scale: isDragging ? 1.1 : 1,
                  backgroundColor: isDragging
                    ? "#e0e7ff"
                    : "hsl(0 0% 100% / 0)",
                  color: isDragging ? "#4f46e5" : "#64748b",
                }}
                transition={{ duration: 0.2 }}
              >
                <FiUploadCloud className={styles.icon} />
              </motion.div>

              <div className={styles.textStack}>
                <h3 id="upload-heading" className={styles.title}>
                  Import your document
                </h3>
                <p className={styles.subtitle}>Click to upload</p>
                <p className={styles.subtitleDesktop}>
                  Drag or click to upload
                </p>
              </div>
            </label>
          </motion.div>
        ) : (
          <FilePreviewCard
            key="file-card"
            file={file}
            onAnalyze={onAnalyze}
            onRemove={handleRemoveFile}
            isAnalyzing={isAnalyzing}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
