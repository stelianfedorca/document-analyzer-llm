import { Header } from "../Header";
import { MaxWidthWrapper } from "../MaxWidthWrapper";
import styles from "./AppShell.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <MaxWidthWrapper>{children}</MaxWidthWrapper>
      </main>
      <footer className={styles.footer}>Footer</footer>
    </div>
  );
}
