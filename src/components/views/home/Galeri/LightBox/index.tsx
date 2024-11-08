import Modal from "@/components/element/Modal";
import React, { FC, useState } from "react";
import Image from "next/image";
import styles from "./lightbox.module.scss";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface propsType {
  onClose: () => void;
  data: string[];
  isOpen: number;
}

const LightBox: FC<propsType> = ({ onClose, data, isOpen }) => {
  const [isSelected, setIsSelected] = useState(isOpen);

  const handleNext = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    isSelected < data.length ? setIsSelected(isSelected + 1) : setIsSelected(1);
  };

  const handlePrevious = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    isSelected <= 1
      ? setIsSelected(data.length)
      : setIsSelected(isSelected - 1);
  };

  return (
    <Modal onClose={onClose}>
      {data &&
        data.map((item, index) => {
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
                {newIndex} dari {data.length}
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
    </Modal>
  );
};

export default LightBox;
