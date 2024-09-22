import React, { Fragment } from "react";
import styles from "./homemenu.module.scss";
import Link from "next/link";

const HomeMenu = () => {
  return (
    <Fragment>
      <Link href={"/"} className={`${styles.list} `}>
        Beranda
      </Link>
      <Link href={"/product"} className={styles.list}>
        produk
      </Link>
      <button tabIndex={0} className={styles["button"]}>
        Kategori
      </button>
      <Link href={"/product"} className={styles.list}>
        Tentang
      </Link>
      <Link href={"/product"} className={styles.list}>
        Kontak
      </Link>
    </Fragment>
  );
};

export default HomeMenu;
