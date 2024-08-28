"use client";
import { List } from "lucide-react";
import styles from "./caraosel.module.scss";
import Link from "next/link";
const Carousel = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__title}>
          <List width={20} height={20} />
          <h5>List Carousel</h5>
        </div>
        <Link
          href="/admin/master-data/desain/carousel"
          className={styles.header__btn}
        >
          Tambah
        </Link>
      </div>
      <div className={styles.content}>
        <div className={styles.content__list}>
          <div className="flex gap-1">
            <div className={styles.content__list__image}></div>
            <p>image</p>
          </div>

          <div>
            <button>edit</button>
            <button>hapus</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
