import React from "react";
import styles from "./loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loading}></div>
      <small style={{ marginTop: "0.5rem" }}>Loading</small>
    </div>
  );
};

export default Loader;
