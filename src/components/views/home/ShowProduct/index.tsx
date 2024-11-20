import Image from "next/image";
import styles from "./product.module.scss";
import { Lora } from "next/font/google";
import { formatCurrency } from "@/utils/contant";
import Link from "next/link";
import { FC } from "react";
import { TypeProduct } from "@/services/type.module";
import StarComp from "@/components/element/Star";

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
            const collection = item.collectionName.name.replace(/\s/g, "-");
            const id = item._id;

            const structuredData = {
              "@context": "https://schema.org",
              "@type": "Product",
              name: item.name,
              description:
                item.description || "Deskripsi produk belum tersedia",
              image: item.image[0],
              offers: {
                "@type": "Offer",
                priceCurrency: "IDR",
                price: item.price,
                availability:
                  item.stock.reduce((a, b) => a + b.stock, 0) > 0
                    ? "InStock"
                    : "OutOfStock",
                url: `/produk/${collection}/${id}`,
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: item.averageRating || 0,
                reviewCount: item.reviewCount || 0,
              },
            };
            return (
              <Link
                href={`/produk/${collection}/${id}`}
                key={item._id}
                className={styles.scroller__card}
                prefetch
              >
                <div className={styles.scroller__card__image}>
                  <Image
                    src={item.image[0]}
                    alt="image"
                    width={500}
                    height={500}
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

                <StarComp item={item} name="product" />

                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                  }}
                />
              </Link>
            );
          })}
      </div>
      <Link href={"/produk"} className={styles.showall}>
        <span>Lihat Semua</span>
      </Link>
    </div>
  );
};

export default ShowProductView;
