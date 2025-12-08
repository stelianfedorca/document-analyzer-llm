import { MaxWidthWrapper } from "../MaxWidthWrapper";
import styles from "./AppShell.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>Header</header>
      <main className={styles.main}>
        <MaxWidthWrapper>{children}</MaxWidthWrapper>
      </main>
      <footer className={styles.footer}>Footer</footer>
    </div>
  );
}
