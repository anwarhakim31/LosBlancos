import React from "react";
import styles from "./button.module.scss";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  title: string;
  loading?: boolean;
}

const ButtonElement: React.FC<ButtonProps> = ({ type, title, loading }) => {
  return (
    <button type={type} className={styles.button} disabled={loading}>
      {loading && <span className={styles.button__loader}></span>}
      {loading ? "Loading..." : title}
    </button>
  );
};

export default ButtonElement;
