"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./caraousel.module.scss";
import Link from "next/link";
import Image from "next/image";
import { TypeCarousel } from "@/services/type.module";

const HomeCarousel = ({
  data,
}: {
  data: { success: boolean; carousel: TypeCarousel[]; message: string };
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const item = data.carousel || [];

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
          {item.map((item, i) => (
            <Fragment key={item._id}>
              <Image
                src={item?.image}
                width={1000}
                height={1000}
                alt="image"
                className={`${styles.wrapper__sliders__slider} ${
                  activeIndex === i ? styles["wrapper__sliders__active"] : ""
                }`}
                priority
              />
              {activeIndex === i ? (
                <div className={styles.content}>
                  <div className={styles.content__text}>
                    <span className={styles.content__text__caption}>
                      {item?.caption}
                    </span>
                    <h1 className={styles.content__text__title}>
                      {item?.title}
                    </h1>
                    <p className={styles.content__text__description}>
                      {item?.description}
                    </p>
                    <Link
                      href={item?.url}
                      className={styles.content__text__btn}
                    >
                      Belanja Sekarang
                    </Link>
                  </div>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
        <div className={styles.wrapper__dots}>
          {item.map((item, i) => (
            <div
              key={item._id}
              onClick={() => setActiveIndex(i)}
              className={`${styles.wrapper__dots__dot} ${
                activeIndex === i ? styles["wrapper__dots__dot__active"] : ""
              }`}
            ></div>
          ))}
        </div>
      </div>
      <div className={styles.content_mobile}>
        {item.map((item, i) => (
          <Fragment key={item._id}>
            {activeIndex === i ? (
              <Fragment>
                <span className={styles.content_mobile__caption}>
                  {item?.caption}
                </span>
                <h1 className={styles.content_mobile__title}>{item?.title}</h1>
                <p className={styles.content_mobile__description}>
                  {item?.description}
                </p>
                <Link href="/product" className={styles.content_mobile__btn}>
                  Belanja Sekarang
                </Link>
              </Fragment>
            ) : null}
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
};

export default HomeCarousel;
