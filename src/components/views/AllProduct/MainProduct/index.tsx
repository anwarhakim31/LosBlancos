"use client";

import { FC, useEffect, useState } from "react";
import styles from "./product.module.scss";
import { formatCurrency } from "@/utils/contant";
import Link from "next/link";
import Image from "next/image";
import { TypeProduct } from "@/services/type.module";
import { ChevronLeft, ChevronRight, SlidersHorizontalIcon } from "lucide-react";
import InputSearch from "@/components/element/InputSearch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Modal from "@/components/element/Modal";
import FilterProductView from "../FilterProduct";
import StarComp from "@/components/element/Star";

interface paginationType {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface propsType {
  products: TypeProduct[];
  pagination: paginationType;
}

const ProductMainView: FC<propsType> = ({ products, pagination }) => {
  const pathname = usePathname();
  const router = useRouter();
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

  const { page, totalPage } = pagination;

  const pageNumber = [];

  for (let i = 1; i <= totalPage; i++) {
    pageNumber.push(i);
  }

  const startPage =
    page === totalPage ? Math.max(1, page - 2) : Math.max(1, page - 1);

  const endPage =
    page === 1 ? Math.min(totalPage, page + 2) : Math.min(totalPage, page + 1);

  const invisiblePage = pageNumber.slice(startPage - 1, endPage);

  const handleClose = () => {
    setIsActive(false);
  };

  return (
    <div style={{ flex: "1" }}>
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
            const collection = item.collectionName.name.replace(/\s/g, "-");

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

                  <div>
                    <p className={styles.card__content__price}>
                      {formatCurrency(Number(item.price))}
                    </p>
                    <StarComp item={item} />
                  </div>
                </div>
              </Link>
            );
          })}
        {products.length === 0 ? (
          <div className={styles.noResult}>
            <Image
              src={"/no-results.png"}
              alt="not result"
              width={150}
              height={150}
            />
            <p>Produk tidak ditemukan</p>
          </div>
        ) : null}
      </div>

      {isActive && (
        <Modal onClose={handleClose}>
          <div className={styles.filter} onClick={(e) => e.stopPropagation()}>
            <FilterProductView onClose={handleClose} />
          </div>
        </Modal>
      )}
      <div
        className={styles.pagination}
        style={{ display: products.length > 0 ? "flex" : "none" }}
      >
        <button
          type="button"
          aria-label="previous"
          className={styles.pagination__previous}
          disabled={page === 1}
          onClick={() => {
            const query = new URLSearchParams(params);

            query.set("page", String(page - 1));

            router.push(`${pathname}?${query.toString()}`);
          }}
        >
          <ChevronLeft />
        </button>
        {invisiblePage.map((item) => (
          <button
            type="button"
            aria-label={`page ${item}`}
            className={styles.pagination__page}
            key={item}
            onClick={() => {
              const query = new URLSearchParams(params);

              query.set("page", String(item));

              router.push(`${pathname}?${query.toString()}`);
            }}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          aria-label="next"
          className={styles.pagination__next}
          disabled={page === totalPage}
          onClick={() => {
            const query = new URLSearchParams(params);

            query.set("page", String(page + 1));

            router.push(`${pathname}?${query.toString()}`);
          }}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ProductMainView;
