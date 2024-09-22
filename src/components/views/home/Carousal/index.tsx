"use client";

import { useRef } from "react";
import styles from "./coraousal.module.scss";
import Image from "next/image";

const Caraousal = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.container} ref={containerRef}>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className={styles.container__wrapper}>
          <Image
            src={"/marqueen/1.png"}
            alt="logo"
            height={250}
            width={250}
            priority
            className={styles.logo}
          />
          <Image
            src={"/marqueen/2.png"}
            alt="logo"
            height={250}
            width={250}
            priority
            className={styles.logo}
          />
          <Image
            src={"/marqueen/3.png"}
            alt="logo"
            height={250}
            width={250}
            priority
            className={styles.logo}
          />
          <Image
            src={"/marqueen/4.png"}
            alt="logo"
            height={250}
            width={250}
            priority
            className={styles.logo}
          />
          <Image
            src={"/marqueen/1.png"}
            alt="logo"
            height={250}
            width={250}
            priority
            className={styles.logo}
          />
          <Image
            src={"/marqueen/2.png"}
            alt="logo"
            height={250}
            width={250}
            priority
            className={styles.logo}
          />
          <Image
            src={"/marqueen/3.png"}
            alt="logo"
            height={250}
            width={250}
            priority
            className={styles.logo}
          />
          <Image
            src={"/marqueen/4.png"}
            alt="logo"
            height={250}
            width={250}
            priority
            className={styles.logo}
          />
        </div>
      ))}
    </div>
  );
};

export default Caraousal;
