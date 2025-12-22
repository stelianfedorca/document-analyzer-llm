"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { forwardRef } from "react";
import { navLinks } from "./navLinks";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  function MobileMenu({ isOpen, onClose }, ref) {
    const pathname = usePathname();

    return (
      <div
        ref={ref}
        className={clsx(styles.mobileMenu, {
          [styles.open]: isOpen,
          [styles.closed]: !isOpen,
        })}
        aria-hidden={!isOpen}
        id="mobile-menu"
      >
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.matchPattern);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={clsx(styles.mobileNavLink, "focusRing", {
                  [styles.mobileNavLinkActive]: isActive,
                })}
                tabIndex={isOpen ? 0 : -1}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }
);
