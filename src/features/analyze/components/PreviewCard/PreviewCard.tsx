import { FiRefreshCw, FiX } from "react-icons/fi";
import { FileHeader } from "../FileHeader";
import styles from "./PreviewCard.module.css";
import clsx from "clsx";

function formatFileSizeLabel(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["KB", "MB", "GB", "TB"];
  if (bytes < 1024) return `${Math.round(bytes)} B`;

  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const fractionDigits = value >= 100 ? 0 : 1;
  const formatted = value.toFixed(fractionDigits).replace(/\.0$/, "");
  return `${formatted} ${units[unitIndex]}`;
}

interface Props {
  file: File;
  onRemove: () => void;
  onChangeFile?: () => void;
  isAnalyzing?: boolean;
}

export function PreviewCard({ file, onRemove, onChangeFile }: Props) {
  const fileSizeLabel = formatFileSizeLabel(file.size);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <FileHeader file={file} fileSizeLabel={fileSizeLabel} />
          <button
            onClick={onRemove}
            className={clsx(styles.removeButton, "focusRing")}
            aria-label="Remove file"
          >
            <FiX aria-hidden="true" className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.actionsRow}>
          <button
            onClick={onChangeFile}
            className={clsx(styles.changeButton, "focusRing")}
            aria-label="Change file"
          >
            <div className={styles.refreshIconWrapper}>
              <FiRefreshCw aria-hidden="true" focusable="false" />
            </div>
            <span>Change file</span>
          </button>
        </div>
      </div>
    </div>
  );
}
