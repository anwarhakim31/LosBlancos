import React, { FC, useState } from "react";
import Image from "next/image";
import styles from "./lightbox.module.scss";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import PortalNotification from "@/components/element/PortalNotification";

interface propsType {
  onClose: () => void;
  data: { image: string[]; blurDataURL: string[] };
  isOpen: number;
}

const LightBox: FC<propsType> = ({ onClose, data, isOpen }) => {
  const [isSelected, setIsSelected] = useState(isOpen);

  const handleNext = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    isSelected < data?.image.length
      ? setIsSelected(isSelected + 1)
      : setIsSelected(1);
  };

  const handlePrevious = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    isSelected <= 1
      ? setIsSelected(data.image.length)
      : setIsSelected(isSelected - 1);
  };

  console.log(data.blurDataURL);

  return (
    <PortalNotification onClose={onClose}>
      {data &&
        data.image.map((item, index) => {
          const newIndex = index + 1;

          return (
            <div
              key={newIndex}
              className={styles.container}
              onClick={handleNext}
              style={{ display: isSelected === newIndex ? "block" : "none" }}
            >
              <Image
                src={item}
                alt="galeri1"
                width={1000}
                height={1000}
                loading="lazy"
              />
              <p>
                {newIndex} dari {data.image.length}
              </p>
            </div>
          );
        })}
      <button
        title="Tutup"
        className={styles.btn}
        style={{ top: "10px", right: "10px" }}
        onClick={() => onClose()}
      >
        <X />
      </button>
      <button
        title="Selanjutnya"
        className={styles.arrow}
        style={{ top: "50%", right: "10px" }}
        onClick={handleNext}
      >
        <ChevronRight />
      </button>
      <button
        title="Sebelumnya"
        className={styles.arrow}
        style={{ top: "50%", left: "10px" }}
        onClick={handlePrevious}
      >
        <ChevronLeft />
      </button>
    </PortalNotification>
  );
};

export default LightBox;
