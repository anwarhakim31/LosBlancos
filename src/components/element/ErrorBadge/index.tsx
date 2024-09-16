import React from "react";
import styles from "./errrorbadge.module.scss";

const ErrorBadge = ({ isError }: { isError: string }) => {
  if (!isError) {
    return null;
  }

  return (
    <div className={styles.badge}>
      <span className={styles.badge__error}>{isError}</span>
    </div>
  );
};

export default ErrorBadge;
