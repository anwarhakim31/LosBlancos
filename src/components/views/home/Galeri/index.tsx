"use client";

import Image from "next/image";
import styles from "./galeri.module.scss";
import { Lora } from "next/font/google";
import { Fragment, useState } from "react";
import LightBox from "./LightBox";

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const GaleriView = () => {
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [data, setData] = useState<string[]>(["/s.webp", "/1.jpg", "/2.jpg"]);

  const handleOpen = (index: number) => {
    setIsOpen(index);
  };
  console.log(setData);

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={lora.className}>Ikuti Kami di Instagram</h1>

        <div className={styles.container__wrapper}>
          {[...data, ...data].map((item, index) => (
            <div
              className={styles.container__wrapper__item}
              key={index + 1}
              onClick={() => handleOpen(index + 1)}
            >
              <Image src={item} alt="galeri1" width={1000} height={1000} />
            </div>
          ))}
        </div>
      </div>
      {isOpen ? (
        <LightBox data={data} isOpen={isOpen} onClose={() => setIsOpen(null)} />
      ) : null}
    </Fragment>
  );
};

export default GaleriView;
