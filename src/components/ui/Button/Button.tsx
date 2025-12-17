import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import styles from "./Button.module.css";
import clsx from "clsx";
import { ImSpinner2 } from "react-icons/im";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  state?: string;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      icon,
      iconPosition = "left",
      disabled,
      className,
      state,
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
        aria-busy={isLoading}
        data-state={state}
        {...props}
      >
        <span className={styles.content}>
          {icon && iconPosition === "left" && (
            <span className={styles.icon}>{icon}</span>
          )}
          <span className={styles.label}>{children}</span>
          {icon && iconPosition === "right" && (
            <span className={styles.icon}>{icon}</span>
          )}
        </span>
        {isLoading && (
          <ImSpinner2 className={styles.spinner} aria-hidden="true" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
