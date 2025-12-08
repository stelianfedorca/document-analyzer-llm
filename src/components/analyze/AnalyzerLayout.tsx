import styles from "./AnalyzerLayout.module.css";

export default function AnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="maxWidthWrapper">
      <div className={styles.layout}>{children}</div>
    </div>
  );
}
