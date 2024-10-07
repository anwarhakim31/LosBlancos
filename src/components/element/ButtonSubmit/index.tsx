import React from "react";
import styles from "./button.module.scss";

interface ButtonProps {
  title: string;
  loading?: boolean;
}

const ButtonSubmit: React.FC<ButtonProps> = ({ title, loading }) => {
  return (
    <button type="submit" className={styles.button} disabled={loading}>
      {loading && <span className={styles.button__loader}></span>}
      {loading ? "Loading" : title}
    </button>
  );
};

export default ButtonSubmit;
