"use client";

import clsx from "clsx";
import { motion, useAnimation } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FiAlertCircle, FiUploadCloud } from "react-icons/fi";

import styles from "./DropZone.module.css";

interface Props {
  onFileSelected: (file: File) => void;
}

export function DropZone({ onFileSelected }: Props) {
  const [error, setError] = useState<string | null>(null);
  const controls = useAnimation();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;
      if (file) {
        setError(null);
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const handleDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      const [rejection] = fileRejections;
      if (rejection) {
        if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Only PDF, DOCX, and TXT files are supported");
        } else {
          setError(rejection.errors[0]?.message || "Something went wrong");
        }

        // Trigger shake animation
        controls.start({
          x: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.4 },
        });
      }
    },
    [controls]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleDrop,
      multiple: false,
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "text/plain": [".txt"],
      },
      onDropRejected: handleDropRejected,
    });

  const rootProps = getRootProps({
    className: clsx(styles.container, {
      [styles.active]: isDragActive,
      [styles.rejected]: isDragReject || !!error,
    }),
  });

  return (
    <motion.div {...rootProps} animate={controls}>
      <input {...getInputProps({ className: styles.input })} />

      <div className={styles.dropArea}>
        <motion.div
          className={styles.iconWrap}
          animate={{
            scale: isDragActive ? 1.08 : 1,
            backgroundColor: isDragReject
              ? "#fef2f2"
              : isDragActive
              ? "#eef2ff"
              : "#ffffff",
            color: isDragReject
              ? "#ef4444"
              : isDragActive
              ? "#4338ca"
              : "#64748b",
            borderColor: isDragReject ? "#fee2e2" : "#e2e8f0",
          }}
          transition={{ duration: 0.1 }}
        >
          {isDragReject || error ? (
            <FiAlertCircle className={styles.icon} />
          ) : (
            <FiUploadCloud className={styles.icon} />
          )}
        </motion.div>

        <div className={styles.textStack}>
          <h3 id="upload-heading" className={styles.title}>
            {error ? "Unsupported file" : "Import your document"}
          </h3>
          {error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : (
            <>
              <p className={styles.subtitle}>Click to upload</p>
              <p className={styles.subtitleDesktop}>Drag or click to upload</p>
              <p className={styles.subtitleDesktop}>
                Supported formats: PDF, DOCX, TXT
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
