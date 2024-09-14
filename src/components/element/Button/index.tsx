import React from "react";
import styles from "./button.module.scss";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  title: string;
  loading?: boolean;
}

const ButtonElement: React.FC<ButtonProps> = ({ type, title, loading }) => {
  return (
    <button type={type} className={styles.button}>
      {loading ? "Loading..." : title}
    </button>
  );
};

export default ButtonElement;
