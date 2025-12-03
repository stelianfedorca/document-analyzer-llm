import { FiActivity, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import styles from "./ResultPanel.module.css";

interface Props {
  results: any;
  isLoading: boolean;
  error: Error | null;
}

export function ResultPanel({ results, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <div className={`${styles.iconWrapper} ${styles.loading}`}>
            <FiActivity className={`${styles.icon} ${styles.spin}`} />
          </div>
          <h3 className={styles.title}>Analyzing document...</h3>
          <p className={styles.subtitle}>
            This may take a few moments. Please wait.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <div className={`${styles.iconWrapper} ${styles.error}`}>
            <FiAlertCircle className={styles.icon} />
          </div>
          <h3 className={styles.title}>Analysis failed</h3>
          <p className={styles.subtitle}>{error.message}</p>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className={styles.container}>
        <div className={styles.results}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <FiCheckCircle className={styles.icon} />
            </div>
            <h3 className={styles.title}>Analysis Complete</h3>
          </div>
          <pre className={styles.jsonOutput}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <div className={styles.iconWrapper}>
          <FiActivity className={styles.icon} />
        </div>
        <h3 className={styles.title}>Ready to analyze</h3>
        <p className={styles.subtitle}>
          Upload a document and click "Analyze" to see the results here.
        </p>
      </div>
    </div>
  );
}
