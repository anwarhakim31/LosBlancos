"use client";

import Image from "next/image";
import styles from "./galeri.module.scss";
import { Lora } from "next/font/google";
import { Fragment, useState } from "react";
import LightBox from "./LightBox";
import { Instagram } from "lucide-react";
import Link from "next/link";

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const GaleriView = ({ data }: { data: string[] }) => {
  const [isOpen, setIsOpen] = useState<number | null>(null);

  const handleOpen = (index: number) => {
    setIsOpen(index);
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={lora.className}>Ikuti Kami di Instagram</h1>
        <p>
          Beberapa foto terbaru dari kami di Instagram. Jangan lupa untuk follow
          kami di{" "}
          <Link href="https://instagram.com" target="_blank">
            @Instagram
          </Link>
          .
        </p>

        <div className={styles.container__wrapper}>
          {data.map((item, index) => (
            <div
              className={styles.container__wrapper__item}
              key={index + 1}
              onClick={() => handleOpen(index + 1)}
            >
              <Image
                src={item}
                alt={`galeri${index + 1}`}
                width={1000}
                height={1000}
                quality={100}
                priority
              />
              <div className={styles.container__wrapper__item__icon}>
                <Instagram />
              </div>
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
