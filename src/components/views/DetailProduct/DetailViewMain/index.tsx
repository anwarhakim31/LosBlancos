"use client";

import BreadCrubm from "@/components/element/BreadCrubm";
import styles from "./detail.module.scss";

import { TypeProduct, TypeReview } from "@/services/type.module";

import DetailImageView from "../DetailImageView";
import DetailInfoView from "../DetailInfoView";
import { useState } from "react";
import Image from "next/image";
import StarComp from "@/components/element/Star";
import { formateDate, formatTime } from "@/utils/contant";
import Pagination from "@/components/element/Pagination";
import { Star } from "lucide-react";

const navigation = ["deskripsi", "ulasan & rating"];

const DetailProductView = ({
  product,
  reviews,
  pagination,
  ratingsSummary,
}: {
  product: TypeProduct;
  reviews: TypeReview[];
  pagination: { totalPage: number; total: number; page: number; limit: number };
  ratingsSummary: { star: number; count: number; percentage: number }[];
}) => {
  const [isSelect, setIsSelect] = useState("deskripsi");

  return (
    <section className={styles.container}>
      <BreadCrubm />
      <div className={styles.wrapper}>
        <DetailImageView product={product} />
        <DetailInfoView product={product} />
      </div>
      <div className={styles.footer}>
        <div className={styles.footer__navigation}>
          {navigation.map((item, index) => (
            <button
              key={index}
              className={isSelect === item ? styles.active : ""}
              onClick={() => setIsSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {isSelect === "deskripsi" && (
          <div className={styles.footer__description}>
            <h3>Deskripsi</h3>
            <p>{product?.description}</p>
          </div>
        )}
        {isSelect === "ulasan & rating" && (
          <div className={styles.footer__reviews}>
            <h3>Ulasan & Rating </h3>
            <div className={styles.footer__reviews__header}>
              <div className={styles.footer__reviews__header__rating}>
                <h1> {product?.averageRating}</h1>
                <div>
                  <StarComp item={product} name="product" />
                  <h5>{product.reviewCount} Penilai</h5>
                </div>
              </div>

              <div className={styles.footer__reviews__header__allrating}>
                {ratingsSummary?.map((item) => (
                  <div
                    key={item.star}
                    className={styles.footer__reviews__header__allrating__item}
                  >
                    <p>{item.star}</p>
                    <Star />
                    <div
                      className={
                        styles.footer__reviews__header__allrating__item__proggress
                      }
                    >
                      <div
                        className={
                          styles.footer__reviews__header__allrating__item__bar
                        }
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <p>{item.percentage}</p>
                  </div>
                ))}
              </div>
            </div>

            {reviews &&
              reviews?.map((item: TypeReview) => (
                <div key={item._id} className={styles.footer__reviews__item}>
                  <figure className={styles.footer__reviews__item__image}>
                    <Image
                      src={item?.user?.image || "/profile.png"}
                      alt={item.user?.fullname || "user"}
                      width={100}
                      height={100}
                    />
                  </figure>

                  <div className={styles.footer__reviews__item__content}>
                    <div className={styles.footer__reviews__item__top}>
                      <h2>{item?.user?.fullname}</h2>
                      <span>{`${formateDate(
                        item?.updatedAt as Date
                      )} ${formatTime(item?.updatedAt as Date)}`}</span>
                    </div>
                    <StarComp
                      item={{ rating: item?.rating, sold: 0 }}
                      name="review"
                    />
                    <p>{item?.comment}</p>
                  </div>
                </div>
              ))}
            <Pagination pagination={pagination} />
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailProductView;
