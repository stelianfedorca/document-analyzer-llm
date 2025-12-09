import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./Button.module.css";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const buttonStyles = clsx(
      styles.button,
      styles[variant],
      styles[size],
      {
        [styles.disabled]: disabled || isLoading,
        [styles.loading]: isLoading,
        [styles.fullWidth]: fullWidth,
      },
      className
    );

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={buttonStyles}
        {...props}
      >
        {isLoading ? <span className={styles.spinner} /> : children}
      </button>
    );
  }
);
