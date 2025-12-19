"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

import styles from "./DropZone.module.css";

interface Props {
  onFileSelected: (file: File) => void;
}

export function DropZone({ onFileSelected }: Props) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;
      if (file) {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
  });

  const rootProps = getRootProps({
    className: clsx(styles.container, {
      [styles.active]: isDragActive,
    }),
  });

  return (
    <motion.div {...rootProps}>
      <input {...getInputProps({ className: styles.input })} />

      <div className={styles.dropArea}>
        <motion.div
          className={styles.iconWrap}
          animate={{
            scale: isDragActive ? 1.08 : 1,
            backgroundColor: isDragActive ? "#eef2ff" : "#ffffff",
            color: isDragActive ? "#4338ca" : "#64748b",
          }}
          transition={{ duration: 0.1 }}
        >
          <FiUploadCloud className={styles.icon} />
        </motion.div>

        <div className={styles.textStack}>
          <h3 id="upload-heading" className={styles.title}>
            Import your document
          </h3>
          <p className={styles.subtitle}>Click to upload</p>
          <p className={styles.subtitleDesktop}>Drag or click to upload</p>
          <p className={styles.subtitleDesktop}>
            Supported formats: PDF, DOCX, TXT
          </p>
        </div>
      </div>
    </motion.div>
  );
}
