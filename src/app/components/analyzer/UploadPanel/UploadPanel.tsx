"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";
import styles from "./UploadPanel.module.css";

export function UploadPanel() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    console.log("drag over...");
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

    // Handle file drop
    const file = e.dataTransfer.files;
    console.log({ file });
  };

  return (
    <section className={styles.container} aria-labelledby="upload-heading">
      <div
        className={`${styles.uploadArea} ${isDragging ? styles.active : ""}`}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className={styles.input}
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
              backgroundColor: isDragging ? "#e0e7ff" : "transparent",
              color: isDragging ? "#4f46e5" : "#64748b",
            }}
            transition={{ duration: 0.2 }}
          >
            <FiUploadCloud className={styles.icon} />
          </motion.div>

          <div className={styles.textStack}>
            <h3 id="upload-heading" className={styles.title}>
              Import your file
            </h3>
            <p className={styles.subtitle}>Click to upload</p>
            <p className={styles.subtitleDesktop}>Drag or click to upload</p>
          </div>
        </label>
      </div>
    </section>
  );
}
