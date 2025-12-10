import styles from "./MaxWidthWrapper.module.css";

export default function MaxWidthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
