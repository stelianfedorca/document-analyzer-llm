"use client";
import { createContext, useContext, useState } from "react";
import { Toast } from "radix-ui";
import { FiX } from "react-icons/fi";
import styles from "./ToastProvider.module.css";

type ToastVariant = "info" | "success" | "error";

type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

const ToastContext = createContext<{
  showToast: (opts: ToastOptions) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<ToastOptions>({
    title: "",
    description: "",
    variant: "info",
  });

  const showToast = (opts: ToastOptions) => {
    setToast({ variant: "info", ...opts });
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right" duration={2000}>
        {children}
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className={`${styles.toastRoot} ${styles[toast.variant ?? "info"]}`}
        >
          <Toast.Title className={styles.toastTitle}>{toast.title}</Toast.Title>
          {toast.description && (
            <Toast.Description className={styles.toastDescription}>
              {toast.description}
            </Toast.Description>
          )}
          <Toast.Close className={styles.toastClose} aria-label="Close">
            <FiX aria-hidden />
          </Toast.Close>
        </Toast.Root>
        {/* The place where radix renders the toast */}
        <Toast.Viewport className={styles.toastViewport} />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
