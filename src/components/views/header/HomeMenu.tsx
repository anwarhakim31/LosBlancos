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
      <span className={styles["list"]}>Kategori</span>
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
