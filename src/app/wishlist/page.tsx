"use client";
import BreadCrubm from "@/components/element/BreadCrubm";
import styles from "./wishlist.module.scss";
import Image from "next/image";
import { Star, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { formatCurrency } from "@/utils/contant";

import { Fragment } from "react";
import Footer from "@/components/layouts/Footer";
import Link from "next/link";
import { removeWishlist } from "@/store/slices/wishSlice";
const WishListPage = () => {
  const dispatch = useAppDispatch();
  const { wishlist, loading } = useAppSelector((state) => state.wishlist);

  const handleWishlist = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (id) {
      dispatch(removeWishlist({ id }));
    }
  };

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <BreadCrubm />
          <h1>Daftar Keinginan</h1>
          <div className={styles.content}>
            {loading && wishlist.length === 0 && (
              <div className={styles.card_loader}>
                <div className={styles.loading}></div>
              </div>
            )}
            {!loading &&
              wishlist.length > 0 &&
              wishlist.map((item) => {
                const collection = item.product.collectionName.name.replace(
                  /\s/g,
                  "-"
                );
                const id = item.product._id;
                return (
                  <Link
                    href={`/produk/${collection}/${id}`}
                    className={styles.card}
                    key={item._id}
                  >
                    <button
                      type="button"
                      aria-label="remove from wishlist"
                      className={styles.remove}
                      onClick={(e) =>
                        handleWishlist(e, item.product._id as string)
                      }
                    >
                      <X />
                    </button>
                    <div className={styles.card__image}>
                      <Image
                        src={item.product.image[0]}
                        alt="image"
                        width={1000}
                        height={1000}
                        priority
                      />
                    </div>
                    <div className={styles.card__content}>
                      <div className={styles.card__content__head}>
                        <p className={styles.card__content__collection}>
                          {item.product.collectionName.name}
                        </p>

                        <h3 className={styles.card__content__title}>
                          {item.product.name}
                        </h3>
                      </div>
                      <div>
                        <p className={styles.card__content__price}>
                          {formatCurrency(Number(item.product.price))}
                        </p>
                        <div className={styles.card__content__rating}>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star key={index} />
                          ))}
                          <p>({Math.round(5.1)})</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            {!loading && wishlist.length === 0 && (
              <div className={styles.empty}>
                <Image
                  src={"/empty-wishlist.png"}
                  alt="image"
                  width={150}
                  height={150}
                />
                <p>Daftar keinginan anda kosong.</p>
                <span>
                  Tap simbol hati pada produk untuk menambahkan keinginan .
                </span>
                <Link className={styles.button} href={"/"}>
                  Belanja Sekarang
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default WishListPage;
