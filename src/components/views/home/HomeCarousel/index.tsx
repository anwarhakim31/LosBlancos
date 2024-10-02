"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./sliders.module.scss";
import image1 from "@/assets/carousel1.webp";
import image2 from "@/assets/carousel2.webp";
import image3 from "@/assets/carousel3.webp";
import Link from "next/link";
import Image from "next/image";

const HomeCarousel = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const item = [
    {
      color: "red",
      id: 0,
      image: image3,
    },
    {
      color: "blue",
      id: 1,
      image: image2,
    },
    {
      color: "green",
      id: 2,
      image: image1,
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
    <Fragment>
      <div className={styles.wrapper}>
        <div className={styles.wrapper__sliders}>
          {item.map((item) => (
            <Fragment key={item.id}>
              <Image
                src={item?.image.src}
                width={1000}
                height={1000}
                alt="image"
                className={`${styles.wrapper__sliders__slider} ${
                  activeIndex === item.id
                    ? styles["wrapper__sliders__active"]
                    : ""
                }`}
                priority
              />
              <div className={styles.content}>
                <div className={styles.content__text}>
                  <span className={styles.content__text__caption}>
                    losblancos
                  </span>
                  <h1 className={styles.content__text__title}>
                    Official Store Indonesia
                  </h1>
                  <p className={styles.content__text__description}>
                    Belanja berbagai macam jersey Real madrid. untuk menunjukan
                    anda adalah seorang madridista
                  </p>
                  <Link href="/product" className={styles.content__text__btn}>
                    Belanja Sekarang
                  </Link>
                </div>
              </div>
            </Fragment>
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
      <div className={styles.content_mobile}>
        <span className={styles.content_mobile__caption}>losblancos</span>
        <h1 className={styles.content_mobile__title}>
          Official Store Indonesia
        </h1>
        <p className={styles.content_mobile__description}>
          Belanja berbagai macam jersey Real madrid. untuk menunjukan anda
          adalah seorang madridista
        </p>
        <Link href="/product" className={styles.content_mobile__btn}>
          Belanja Sekarang
        </Link>
      </div>
    </Fragment>
  );
};

export default HomeCarousel;
