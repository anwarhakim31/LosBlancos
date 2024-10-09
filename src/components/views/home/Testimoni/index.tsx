"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./testimoni.module.scss";
import { Lora } from "next/font/google";
import { useRef } from "react";
const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const TestimoniView = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container}>
      <div className={styles.container__head}>
        <h1 className={lora.className}>Testimoni Pelanggan</h1>
        <div className={styles.container__head__btn}>
          <button
            type="button"
            aria-label="scroll-left"
            onClick={() =>
              wrapperRef.current?.scrollBy({ left: -250, behavior: "smooth" })
            }
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="scroll-right"
            onClick={() =>
              wrapperRef.current?.scrollBy({ left: 250, behavior: "smooth" })
            }
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className={styles.container__max}>
        <div className={styles.container__wrapper} ref={wrapperRef}>
          <div className={styles.container__item}></div>
          <div className={styles.container__item}></div>
          <div className={styles.container__item}></div>
          <div className={styles.container__item}></div>
          <div className={styles.container__item}></div>
          <div className={styles.container__item}></div>
        </div>
      </div>
    </div>
  );
};

export default TestimoniView;
