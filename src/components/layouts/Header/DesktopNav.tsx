"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { navLinks } from "./navLinks";
import styles from "./Header.module.css";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <div className={styles.desktopNavLinks}>
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.matchPattern);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(styles.navLink, "focusRing", {
              [styles.navLinkActive]: isActive,
            })}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
