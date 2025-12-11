import { FiActivity, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import styles from "./ResultPanel.module.css";
import clsx from "clsx";
import { LoadingState } from "../ui/LoadingState";
import { AnalysisReportResponse } from "@/lib/gemini";

interface Props {
  data?: AnalysisReportResponse;
  isLoading: boolean;
  error: Error | null;
}

function formatDocType(docType?: string) {
  if (!docType) return "Unknown";

  return docType.charAt(0).toUpperCase() + docType.slice(1);
}

export function ResultPanel({ data, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <LoadingState />
      // <div className={styles.container}>
      //   <div className={styles.placeholder}>
      //     <div className={`${styles.iconWrapper} ${styles.loading}`}>
      //       <FiActivity className={`${styles.icon} ${styles.spin}`} />
      //     </div>
      //     <h3 className={styles.title}>Analyzing document...</h3>
      //     <p className={styles.subtitle}>
      //       This may take a few moments. Please wait.
      //     </p>
      //   </div>
      // </div>
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

  if (data) {
    // const paragraphs = data.overallSummary?.split("\n");

    console.log(data.overallSummary);
    return (
      <section className={clsx(styles.container)}>
        <header className={styles.header}>
          <h2 className={styles.title}>{data.title || "Summary"}</h2>
          <span className={styles.docType}>
            {formatDocType(data.documentType)}
          </span>
        </header>
        <div className={styles.contentSection}>
          <div className={styles.contentSectionInner}>
            <h2 className={styles.sectionTitle}>Main Points</h2>
            <ul className={clsx(styles.mainPointsList)}>
              {data.mainPoints.map((point, index) => {
                return (
                  <li key={index}>
                    {/* {point} */}
                    <p>{point}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className={clsx(styles.contentSection)}>
          <div className={styles.contentSectionInner}>
            <h2 className={styles.sectionTitle}>Overall summary</h2>
            <div className={clsx(styles.summary)}>
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
        </div>
      </section>
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

[
  "This document is a service supply contract between Fedorca Stelian and Digi Romania SA, dated November 28, 2025. It details the provision of Digi TV Cablu (Digital package) and Digi Net (FiberLink 1000) services for a minimum period of 12 months. The Beneficiary benefits from a 100% reduction on installation/activation fees and monthly equipment rental for the TV service.\nKey terms include the Beneficiary's declaration of no prior outstanding debts, agreement to use services within Romania, and responsibility for parental control activation. The contract also outlines Digi Romania's personal data processing practices, including data categories, purposes, legal bases, storage durations, and the Beneficiary's rights under GDPR, with full terms available on Digi Romania's website.",
];
