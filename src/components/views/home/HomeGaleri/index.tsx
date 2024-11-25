"use client";

import Image from "next/image";
import styles from "./galeri.module.scss";
import { Lora } from "next/font/google";
import { Fragment, useEffect, useState } from "react";
import LightBox from "./LightBox";
import { Instagram } from "lucide-react";
import Link from "next/link";
import { useMasterContext } from "@/context/MasterContext";
import { ResponseError } from "@/lib/response-error";
import { masterService } from "@/services/master/method";

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const HomeGaleriView = () => {
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const context = useMasterContext();
  const [data, setData] = useState<string[]>();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await masterService.getGaleri();

        if (res.status === 200) {
          setData(res.data.galeri.image);
          console.log(res);
        }
      } catch (error) {
        ResponseError;
      }
    };

    getData();
  }, []);

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
          <Link
            href={`${
              context?.master?.media?.find((item) => item.name === "instagram")
                ?.url || ""
            }`}
            target="_blank"
          >
            @
            {context?.master?.media
              ?.find((item) => item.name === "instagram")
              ?.url.split("/")[3] || "instagram"}
          </Link>
          .
        </p>

        <div className={styles.container__wrapper}>
          {data?.map((item, index) => (
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
        <LightBox
          data={data || []}
          isOpen={isOpen}
          onClose={() => setIsOpen(null)}
        />
      ) : null}
    </Fragment>
  );
};

export default HomeGaleriView;
