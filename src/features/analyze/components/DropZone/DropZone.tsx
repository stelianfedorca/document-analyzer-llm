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

const formatBytes = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_SIZE_LABEL = formatBytes(MAX_FILE_SIZE_BYTES);
const ICON_VARIANTS = {
  idle: {
    backgroundColor: "#ffffff",
    color: "#64748b",
    borderColor: "#e2e8f0",
  },
  active: {
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    borderColor: "#e2e8f0",
  },
  reject: {
    backgroundColor: "#fef2f2",
    color: "#ef4444",
    borderColor: "#fee2e2",
  },
};

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
        } else if (rejection.errors[0]?.code === "file-too-large") {
          setError(`File is too large. Max size is ${MAX_FILE_SIZE_LABEL}.`);
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
      maxSize: MAX_FILE_SIZE_BYTES,
      onDropRejected: handleDropRejected,
    });

  const iconState =
    isDragReject || !!error ? "reject" : isDragActive ? "active" : "idle";

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
          animate={iconState}
          variants={ICON_VARIANTS}
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
              <p className={styles.subtitleAll}>
                Max size: {MAX_FILE_SIZE_LABEL}
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
