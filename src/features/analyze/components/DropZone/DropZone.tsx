"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

import styles from "./DropZone.module.css";

interface Props {
  onFileSelected: (file: File) => void;
}

export function DropZone({ onFileSelected }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

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
      onFileSelected(droppedFiles[0]);
    }
  };

  return (
    <motion.div
      key="drop-zone"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={clsx(styles.container, {
        [styles.active]: isDragging,
      })}
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
            backgroundColor: isDragging ? "#e0e7ff" : "transparent",
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
          <p className={styles.subtitleDesktop}>Drag or click to upload</p>
        </div>
      </label>
    </motion.div>
  );
}
