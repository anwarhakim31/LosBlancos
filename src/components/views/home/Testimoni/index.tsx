"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import styles from "./testimoni.module.scss";
import { Lora } from "next/font/google";
import { useRef } from "react";
import Image from "next/image";
import { TypeReview } from "@/services/type.module";
const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const TestimoniView = ({ testimoni }: { testimoni: TypeReview[] }) => {
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
          {testimoni.map((item, index) => (
            <div className={styles.container__item} key={index}>
              <div className={styles.container__item__img}>
                <Image
                  src={item.user.image || "default.png"}
                  alt={`testimoni ${index}`}
                  width={100}
                  height={100}
                />
                <div className={styles.container__item__img__quote}>
                  <Quote />
                </div>
              </div>
              <div className={styles.container__item__content}>
                <div className={styles.container__item__content__decor}></div>
                <p>{item.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimoniView;
