import styles from "./page.module.css";
import { AnalyzerClient } from "../../../../components/AnalyzerClient";
import { UploadView } from "@/features/analyze/components/UploadView";

export default function UploadPage() {
  return (
    <UploadView />
    // <div className={styles.page}>
    //   <AnalyzerClient />
    // </div>
  );
}
