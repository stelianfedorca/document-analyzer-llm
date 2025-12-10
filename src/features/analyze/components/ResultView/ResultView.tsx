import { FiActivity, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import styles from "./ResultPanel.module.css";
import clsx from "clsx";
import { AnalysisReportResponse } from "@/lib/gemini";

interface Props {
  data?: AnalysisReportResponse;
  error: Error | null;
}

function formatDocType(docType?: string) {
  if (!docType) return "Unknown";

  return docType.charAt(0).toUpperCase() + docType.slice(1);
}

export function ResultView({ data, error }: Props) {
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

  if (data) {
    // const paragraphs = data.overallSummary?.split("\n");

    console.log(data.overallSummary);
    return (
      <section className={clsx(styles.container)}>
        <div>
          <header className={styles.header}>
            <h2 className={styles.title}>{data.title || "Summary"}</h2>
            <span>{formatDocType(data.documentType)}</span>
          </header>
        </div>
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Main Points</h2>
          <ul className={clsx(styles.mainPointsList, "maxReadingWidth")}>
            {data.mainPoints.map((point, index) => {
              return <li key={index}>{point}</li>;
            })}
          </ul>
        </div>

        <div className={clsx(styles.contentSection)}>
          <h2 className={styles.sectionTitle}>Overall summary</h2>
          <div className={clsx(styles.summary, "maxReadingWidth")}>
            {data.overallSummary.map(
              (paragraph, idx) =>
                paragraph.trim() && (
                  <p key={idx} className={styles.paragraph}>
                    {paragraph}
                  </p>
                )
            )}
          </div>
        </div>
      </section>
    );
  }
}
