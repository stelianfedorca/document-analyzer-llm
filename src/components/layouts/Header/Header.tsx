import Link from "next/link";
import styles from "./Header.module.css";

// import { UserButton } from "@/features/auth/components/UserButton"; // Example

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Left: Brand / Logo */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink}>
            {/* <LogoIcon className={styles.icon} /> */}
            <span className={styles.logoText}>DocuSense</span>
          </Link>
        </div>
        {/* Center: Navigation (Optional) */}
        <nav className={styles.nav}>
          <Link href="/analyze/upload" className={styles.navLink}>
            Analysis
          </Link>
          <Link href="/analyze/history" className={styles.navLink}>
            History
          </Link>
        </nav>
        {/* Right: Actions / Profile */}
        <div className={styles.actions}>
          {/* Placeholder for Client-side User Button */}
          <div className={styles.userPlaceholder}>
            <div className={styles.avatar} />
          </div>
        </div>
      </div>
    </header>
  );
}
