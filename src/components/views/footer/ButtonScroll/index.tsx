"use client";

import { GoChevronUp } from "react-icons/go";
import styles from "./buttonscroll.module.scss";
import { useEffect, useState } from "react";

const ButtonScroll = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [scrollY, setScrollY] = useState<number>(0);

  const handleScrolls = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrolls);

    return () => {
      window.removeEventListener("scroll", handleScrolls);
    };
  }, []);

  useEffect(() => {
    if (scrollY > 300) {
      console.log(true);
    }
  }, [scrollY]);

  return (
    <button type="button" className={styles.button} onClick={handleScroll}>
      <GoChevronUp className={styles.icon} />
    </button>
  );
};

export default ButtonScroll;
