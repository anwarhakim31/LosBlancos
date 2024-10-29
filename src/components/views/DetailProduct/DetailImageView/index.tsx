import styles from "./detail.module.scss";
import Image from "next/image";
import { TypeProduct } from "@/services/type.module";
import { useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
const DetailImageView = ({ product }: { product: TypeProduct }) => {
  const [selected, setSelected] = useState(0);

  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollPosition = imageRef.current.scrollLeft;

        const width = imageRef.current.offsetWidth;

        const newIndex = Math.round(scrollPosition / width);
        setSelected(newIndex);
      }
    };

    const imageContainer = imageRef.current;
    if (imageContainer) {
      imageContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (imageContainer) {
        imageContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  return (
    <div className={styles.images}>
      <ul className={styles.overlay}>
        {product?.image.map((item, i) => (
          <li
            role="list"
            className={`${styles.overlay__image} ${
              selected === i ? styles.overlay__select : ""
            }`}
            key={i}
            onMouseEnter={() => setSelected(i)}
          >
            <Image
              src={item}
              alt={"image" + i + 1}
              width={100}
              height={100}
              priority
            />
          </li>
        ))}
      </ul>
      <div className={styles.image} ref={imageRef}>
        <Image
          src={product?.image[selected]}
          alt="image"
          width={1000}
          height={1000}
          priority
          draggable={false}
          className={styles.image__dekstop}
        />

        {product?.image.map((item, i) => (
          <Image
            key={i}
            src={item}
            alt="image"
            width={1000}
            height={1000}
            priority
            draggable={false}
            className={styles.image__mobile}
          />
        ))}

        <div className={styles.image__carousel}>
          <button
            aria-label="left"
            data-testid="left"
            onClick={() =>
              setSelected((prev) =>
                prev <= 0 ? product?.image?.length - 1 : prev - 1
              )
            }
          >
            <ChevronLeft />
          </button>
          <button
            aria-label="right"
            data-testid="right"
            onClick={() =>
              setSelected((prev) =>
                prev >= product?.image?.length - 1 ? 0 : prev + 1
              )
            }
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className={styles.images__dots}>
        {product?.image?.map((_, i) => (
          <div
            key={i}
            className={`${styles.images__dots__dot} ${
              selected === i ? styles.images__dots__select : ""
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DetailImageView;
