import { FiFileText } from "react-icons/fi";
import styles from "./FileHeader.module.css";

interface Props {
  file: File;
  fileSizeLabel: string;
}

export function FileHeader({ file, fileSizeLabel }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.iconWrapper}>
        <FiFileText
          aria-hidden="true"
          className={styles.icon}
          focusable="false"
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.fileName} title={file.name}>
          {file.name}
        </h3>
        <p className={styles.fileSize}>{fileSizeLabel}</p>
      </div>
    </div>
  );
}
