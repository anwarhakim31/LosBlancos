import React from "react";
import styles from "./button.module.scss";

interface ButtonProps {
  title: string;
  loading?: boolean;
  onClick?: () => void;
}

const ButtonClick: React.FC<ButtonProps> = ({ title, loading, onClick }) => {
  return (
    <button
      type="button"
      className={styles.button}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? "Loading..." : title}
    </button>
  );
};

export default ButtonClick;
