"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// import { UserButton } from "@/features/auth/components/UserButton"; // Example

export function Header() {
  const pathname = usePathname();
  const isAnalysisRoute = pathname.startsWith("/analyze/upload");
  const isHistoryRoute = pathname.startsWith("/analyze/history");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="Primary">
          {/* Left: Brand / Logo */}
          <Link href="/analyze/upload" className={styles.brandName}>
            <span className={styles.brandBase}>Doc</span>
            <span className={styles.brandAccent}>Lense</span>
          </Link>

          <div className={styles.navLinks}>
            <Link
              href="/analyze/upload"
              className={clsx(styles.navLink, {
                [styles.navLinkActive]: isAnalysisRoute,
              })}
            >
              Analysis
            </Link>
            <Link
              href="/analyze/history"
              className={clsx(styles.navLink, {
                [styles.navLinkActive]: isHistoryRoute,
              })}
            >
              History
            </Link>
          </div>
        </nav>
        {/* Right: Actions / Profile */}
        {/* <div className={styles.actions}>
          <div className={styles.userPlaceholder}>
            <div className={styles.avatar} />
          </div>
        </div> */}
      </div>
    </header>
  );
}
