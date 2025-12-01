import { FiActivity } from "react-icons/fi";
import styles from "./ResultPanel.module.css";

export function ResultPanel() {
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
