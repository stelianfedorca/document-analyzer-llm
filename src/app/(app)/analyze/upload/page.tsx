import styles from "./page.module.css";
import { AnalyzerClient } from "../../../../components/AnalyzerClient";

export default function UploadPage() {
  return (
    <div className={styles.page}>
      <AnalyzerClient />
    </div>
  );
}
