import styles from "./AnalysisReportLayout.module.css";

export function AnalysisReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.layout}>{children}</div>;
}
