"use client";

import { useRef } from "react";
import styles from "./marquee.module.scss";
import Image from "next/image";

const HorizontalSlider = ({ data }: { data: string[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.container} ref={containerRef}>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className={styles.container__wrapper}>
          {[...data, ...data, ...data].map((item, index) => (
            <div key={index} className={styles.logo}>
              <Image src={item} alt="logo" height={250} width={250} priority />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HorizontalSlider;
