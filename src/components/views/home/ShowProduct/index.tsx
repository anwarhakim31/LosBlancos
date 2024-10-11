import Image from "next/image";
import styles from "./product.module.scss";
import { Lora } from "next/font/google";
import { formatCurrency } from "@/utils/contant";
import Link from "next/link";
import { FC } from "react";
import { TypeProduct } from "@/services/type.module";

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface PropsType {
  header: string;
  data: TypeProduct[];
}

const ShowProductView: FC<PropsType> = ({ header, data }) => {
  return (
    <div className={styles.container}>
      <h1 className={lora.className}>{header}</h1>
      <div className={styles.scroller}>
        {data.length > 0 &&
          data.map((item) => {
            const collection = item.collectionName.slug;
            const id = item._id;

            return (
              <Link
                href={`/product/${collection}/${id}`}
                key={item._id}
                className={styles.scroller__card}
              >
                <div className={styles.scroller__card__image}>
                  <Image
                    src="/sample1.webp"
                    alt="image"
                    width={1000}
                    height={1000}
                    priority
                    className={styles.scroller__card__image}
                  />
                </div>
                <div className={styles.scroller__card__content}>
                  <p className={styles.scroller__card__content__collection}>
                    {item.collectionName.name}
                  </p>

                  <h3 className={styles.scroller__card__content__title}>
                    {item.name}
                  </h3>
                </div>

                <p className={styles.scroller__card__price}>
                  {formatCurrency(Number(item.price))}
                </p>
              </Link>
            );
          })}
      </div>
      <Link href={"/product"} className={styles.showall}>
        <span>Lihat Semua</span>
      </Link>
    </div>
  );
};

export default ShowProductView;
