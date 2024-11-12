"use client";
import BreadCrubm from "@/components/element/BreadCrubm";
import styles from "./wishlist.module.scss";
import Image from "next/image";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";

import { Fragment, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { removeWishlist } from "@/store/slices/wishSlice";
import { useSession } from "next-auth/react";
import StarComp from "@/components/element/Star";
const WishListPage = () => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const { wishlist, loading } = useAppSelector((state) => state.wishlist);
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);

  const handleWishlist = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (id) {
      dispatch(
        removeWishlist({
          productId: id,
          userId: session?.data?.user?.id as string,
        })
      );
    }
  };

  useEffect(() => {
    if (loading && isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!loading) {
      const timeout = setTimeout(() => {
        setVisible(true);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

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
                <small style={{ marginTop: "0.5rem" }}>Loading</small>
              </div>
            )}

            {wishlist.length > 0 &&
              wishlist.map((item, i) => {
                const collection = item.product.collectionName.name.replace(
                  /\s/g,
                  "-"
                );
                const id = item.product._id;
                return (
                  <Link
                    href={`/produk/${collection}/${id}`}
                    className={`${styles.card} ${
                      visible ? styles.is_visible : styles.is_pending
                    }`}
                    style={{
                      transition: isFirstRender.current
                        ? "none"
                        : `all  ${i * 0.3}s ease`,
                    }}
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
                      <StarComp item={item.product} name="product" />
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
                <Link className={styles.button} href={"/produk"}>
                  Lanjut Belanja
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default WishListPage;
