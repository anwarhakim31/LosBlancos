"use client";

import { GoChevronUp } from "react-icons/go";
import styles from "./buttonscroll.module.scss";

const ButtonScroll = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button type="button" className={styles.button} onClick={handleScroll}>
      <GoChevronUp className={styles.icon} />
    </button>
  );
};

export default ButtonScroll;
