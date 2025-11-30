import Image from "next/image";
import styles from "./page.module.css";
import { AnalyzerClient } from "./components/analyzer/AnalyzerClient";

export default function Home() {
  return (
    <div className={styles.page}>
      <AnalyzerClient />
    </div>
  );
}
