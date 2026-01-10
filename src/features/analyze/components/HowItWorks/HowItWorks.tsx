import { FiUploadCloud, FiCpu, FiFileText } from "react-icons/fi";
import styles from "./HowItWorks.module.css";

export function HowItWorks() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>How it works</h2>
        <p className={styles.subtitle}>
          Get insights from your documents in seconds.
        </p>
      </div>

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.iconWrapper}>
            <FiUploadCloud />
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>1. Upload document</h3>
            <p className={styles.stepDescription}>
              Support for PDF, DOCX, and TXT files up to 10MB.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.iconWrapper}>
            <FiCpu />
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>2. AI Analysis</h3>
            <p className={styles.stepDescription}>
              Our specific AI model extracts key data and pattern.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.iconWrapper}>
            <FiFileText />
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>3. View Report</h3>
            <p className={styles.stepDescription}>
              Get a structured summary and actionable insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
