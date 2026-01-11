"use client";

import { useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaCheck } from "react-icons/fa";
import styles from "./Footer.module.css";
import { MaxWidthWrapper } from "@/components/layouts/MaxWidthWrapper";
import { useToast } from "@/components/ui/ToastProvider/ToastProvider";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("stelian.fedorca25@gmail.com");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <footer className={styles.footer}>
      <MaxWidthWrapper>
        <div className={styles.inner}>
          <div className={styles.brandColumn}>
            <span className={styles.brandName}>DocLens</span>
            <span className={styles.copyright}>
              © {currentYear} Stelian Fedorca. All rights reserved.
            </span>
          </div>

          <div className={styles.socialRow}>
            <a
              href="https://www.linkedin.com/in/stelian-fedorca-08a4b7186/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin className={styles.socialIcon} />
            </a>
            <a
              href="https://github.com/stelianfedorca"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub Profile"
            >
              <FaGithub className={styles.socialIcon} />
            </a>
            <button
              onClick={handleCopyEmail}
              className={styles.copyButton}
              aria-label="Copy Email Address"
              title="Copy Email: stelian.fedorca25@gmail.com"
            >
              {isCopied ? (
                <FaCheck className={styles.socialIcon} />
              ) : (
                <FaEnvelope className={styles.socialIcon} />
              )}
            </button>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
