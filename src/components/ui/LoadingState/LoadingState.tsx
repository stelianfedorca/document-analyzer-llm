import clsx from "clsx";
import styles from "./LoadingState.module.css";

import { FiActivity, FiFileText } from "react-icons/fi";

export function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={clsx(styles.iconWrapper, styles.iconWrapperPulse)}>
        <FiFileText className={styles.iconTilt} size={28} />
      </div>
      <p className={styles.subtitle}>
        This may take a few moments. Please wait.
      </p>
    </div>
  );
}
