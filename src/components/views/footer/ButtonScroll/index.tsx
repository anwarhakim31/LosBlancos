"use client";

import styles from "./buttonscroll.module.scss";
import { ChevronUpIcon } from "lucide-react";

const ButtonScroll = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button type="button" className={styles.button} onClick={handleScroll}>
      <ChevronUpIcon className={styles.icon} />
    </button>
  );
};

export default ButtonScroll;
