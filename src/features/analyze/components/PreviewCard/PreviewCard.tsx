import { FiFileText, FiRefreshCw, FiX } from "react-icons/fi";
import headerStyles from "../FilePreviewCard/FilePreviewCard.module.css";
import styles from "./PreviewCard.module.css";

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

function FileHeader({
  file,
  fileSizeLabel,
}: {
  file: File;
  fileSizeLabel: string;
}) {
  return (
    <div className={styles.header}>
      <div className={headerStyles.iconWrapper}>
        <FiFileText
          aria-hidden="true"
          className={headerStyles.icon}
          focusable="false"
        />
      </div>
      <div className={headerStyles.info}>
        <h3 className={headerStyles.fileName} title={file.name}>
          {file.name}
        </h3>
        <p className={headerStyles.fileSize}>{fileSizeLabel}</p>
      </div>
    </div>
  );
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
        <FileHeader file={file} fileSizeLabel={fileSizeLabel} />
        <button
          onClick={onRemove}
          className={styles.removeButton}
          aria-label="Remove file"
        >
          <FiX aria-hidden="true" className={styles.closeIcon} />
        </button>

        <div className={styles.actionsRow}>
          <button
            onClick={onChangeFile ?? onRemove}
            className={styles.changeButton}
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
