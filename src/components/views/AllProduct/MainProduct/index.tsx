"use client";

import { FC, Fragment, useEffect, useState } from "react";
import styles from "./product.module.scss";
import { formatCurrency } from "@/utils/contant";
import Link from "next/link";
import Image from "next/image";
import { TypeProduct } from "@/services/type.module";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontalIcon,
  Star,
} from "lucide-react";
import InputSearch from "@/components/element/InputSearch";
import { useSearchParams } from "next/navigation";
import Modal from "@/components/element/Modal";
import FilterProductView from "../FilterProduct";

interface paginationType {
  page: number;
  limit: number;
  total: number;
  total_page: number;
}

interface propsType {
  products: TypeProduct[];
  pagination: paginationType;
}

const ProductMainView: FC<propsType> = ({ products, pagination }) => {
  const params = useSearchParams();
  const search = params.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(search);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth > 768) {
        setIsActive(false);
      }
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // const visiblePage = [];

  // for (let i = 1; i > pagination?.total_page; i++) {
  //   visiblePage.push(i);
  // }

  console.log(pagination);

  // console.log(visiblePage);

  return (
    <Fragment>
      <div className={styles.head}>
        <div className={styles.head__search}>
          <InputSearch
            value={searchQuery}
            id="search"
            name="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Nama dari Produk..."
          />
        </div>
        <button
          title="filter"
          type="button"
          className={styles.head__button}
          aria-label="filter"
          onClick={() => setIsActive(!isActive)}
        >
          <SlidersHorizontalIcon />
        </button>
      </div>
      <div className={styles.content}>
        {products.length > 0 &&
          products.map((item: TypeProduct) => {
            const id = item._id;
            const collection = item.collectionName.name;

            return (
              <Link
                href={`/produk/${collection}/${id}`}
                key={item._id}
                className={styles.card}
              >
                <div className={styles.card__image}>
                  <Image
                    src={item.image[0]}
                    alt="image"
                    width={1000}
                    height={1000}
                    priority
                  />
                </div>
                <div className={styles.card__content}>
                  <div className={styles.card__content__head}>
                    <p className={styles.card__content__collection}>
                      {item.collectionName.name}
                    </p>

                    <h3 className={styles.card__content__title}>{item.name}</h3>
                  </div>

                  <p className={styles.card__content__price}>
                    {formatCurrency(Number(item.price))}
                  </p>
                  <div className={styles.card__content__rating}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} />
                    ))}
                    <p>({Math.round(5.1)})</p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      {products.length === 0 && search ? (
        <div className={styles.noResult}>
          <Image
            src={"/no-results.png"}
            alt="not result"
            width={150}
            height={150}
          />
          <p>Barang yang anda cari tidak ditemukan</p>
        </div>
      ) : null}
      {isActive && (
        <Modal onClose={() => setIsActive(false)}>
          <div className={styles.filter}>
            <FilterProductView />
          </div>
        </Modal>
      )}{" "}
      <div className={styles.pagination}>
        <button
          type="button"
          aria-label="previous"
          className={styles.pagination__previous}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          aria-label="next"
          className={styles.pagination__next}
        >
          <ChevronRight />
        </button>
      </div>
    </Fragment>
  );
};

export default ProductMainView;
