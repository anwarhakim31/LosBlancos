"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./sliders.module.scss";

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const item = [
    {
      color: "red",
      id: 0,
    },
    {
      color: "blue",
      id: 1,
    },
    {
      color: "green",
      id: 2,
    },
  ];

  const nextSilde = useCallback(() => {
    if (activeIndex === item.length - 1) {
      setActiveIndex(0);
    } else {
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, item.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSilde();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, item.length, nextSilde]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__sliders}>
        {item.map((item) => (
          <div
            key={item.id}
            className={`${styles.wrapper__sliders__slider} ${
              activeIndex === item.id ? styles["wrapper__sliders__active"] : ""
            }`}
            style={{ backgroundColor: item.color }}
          ></div>
        ))}
      </div>
      <div className={styles.wrapper__dots}>
        {item.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveIndex(item.id)}
            className={`${styles.wrapper__dots__dot} ${
              activeIndex === item.id
                ? styles["wrapper__dots__dot__active"]
                : ""
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
