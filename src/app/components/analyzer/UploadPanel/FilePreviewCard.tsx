import { motion, stagger, Variants } from "framer-motion";
import { FiFileText, FiX } from "react-icons/fi";
import styles from "./FilePreviewCard.module.css";

interface Props {
  file: File;
  onAnalyze: (file: File) => Promise<void>;
  onRemove: () => void;
}

export function FilePreviewCard({ file, onAnalyze, onRemove }: Props) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleAnalyze = async () => {
    await onAnalyze(file);
  };

  /*
    Animation
  */
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: stagger(0.1, { startDelay: 0.05 }),
      },
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <motion.div
      className={styles.wrapper}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className={styles.card} variants={itemVariants}>
        <div className={styles.iconWrapper}>
          <FiFileText className={styles.icon} />
        </div>
        <div className={styles.info}>
          <h4 className={styles.fileName} title={file.name}>
            {file.name}
          </h4>
          <p className={styles.fileSize}>{formatSize(file.size)}</p>
        </div>
        <button
          onClick={onRemove}
          className={styles.removeButton}
          aria-label="Remove file"
        >
          <FiX size={22} />
        </button>
      </motion.div>

      <motion.button
        className={styles.analyzeButton}
        onClick={handleAnalyze}
        variants={itemVariants}
      >
        <span>Analyze</span>
      </motion.button>
    </motion.div>
  );
}
