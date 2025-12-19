import Link from "next/link";
import { FiFileText } from "react-icons/fi";
import styles from "./RecentAnalysisList.module.css";

export function RecentAnalysisList() {
  // TODO: Replace with actual data fetching
  const analyses: unknown[] = [];

  if (analyses.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.illustration}>
          <div className={styles.row}>
            <FiFileText className={styles.docIcon} />
            <div className={styles.bar} />
          </div>
          <div className={styles.row}>
            <FiFileText className={styles.docIcon} />
            <div className={styles.bar} />
          </div>
          <div className={styles.row}>
            <FiFileText className={styles.docIcon} />
            <div className={styles.bar} />
          </div>
        </div>

        <h3 className={styles.title}>
          No analyses yet. Your history will appear here.
        </h3>

        <p className={styles.subtitle}>
          Your recent analyses will show up here after you analyze your first
          document.
        </p>

        {/* <Link href="/analyze/upload" className={styles.ctaLink}>
          Analyze a document
        </Link> */}
      </div>
    );
  }

  return <div className={styles.list}>{/* Render analyses list here */}</div>;
}
