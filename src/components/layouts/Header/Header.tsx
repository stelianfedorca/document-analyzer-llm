"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import clsx from "clsx";
import { useRef, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { useClickOutside } from "@/hooks/useClickOutside";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useClickOutside(menuRef, (event) => {
    // Ignore clicks on the menu button - let the button's onClick handle it
    if (buttonRef.current?.contains(event.target as Node)) {
      return;
    }

    closeMobileMenu();
  });

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="Primary">
          {/* Left: Brand / Logo */}
          <Link
            href="/analyze/upload"
            className={clsx(styles.brandName, "focusRing")}
          >
            <span className={styles.brandBase}>Doc</span>
            <span className={styles.brandAccent}>Lense</span>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            onClick={toggleMobileMenu}
            className={clsx(styles.menuButton, "focusRing")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <HiOutlineX aria-hidden="true" className={styles.menuIcon} />
            ) : (
              <HiOutlineMenu aria-hidden="true" className={styles.menuIcon} />
            )}
            <span className="visually-hidden">
              {isMobileMenuOpen ? "Close menu" : "Open menu"}
            </span>
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          ref={menuRef}
        />
      </div>
    </header>
  );
}
