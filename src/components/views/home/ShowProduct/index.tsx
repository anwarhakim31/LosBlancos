import Image from "next/image";
import styles from "./product.module.scss";
import { Lora } from "next/font/google";
import { formatCurrency } from "@/utils/contant";
import Link from "next/link";
import { FC } from "react";
import { TypeProduct } from "@/services/type.module";
import { Star } from "lucide-react";

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
        {data &&
          data.map((item) => {
            const collection = item.collectionName.name.replace(" ", "-");
            const id = item._id;

            return (
              <Link
                href={`/produk/${collection}/${id}`}
                key={item._id}
                className={styles.scroller__card}
              >
                <div className={styles.scroller__card__image}>
                  <Image
                    src={item.image[0]}
                    alt="image"
                    width={1000}
                    height={1000}
                    priority
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
                <div className={styles.scroller__card__rating}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} />
                  ))}
                  <p>({Math.round(5.1)})</p>
                </div>
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
