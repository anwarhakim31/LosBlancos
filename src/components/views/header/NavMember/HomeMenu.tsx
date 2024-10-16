import React, { Fragment } from "react";
import styles from "./homemenu.module.scss";
import Link from "next/link";
import { TypeCollection } from "@/services/type.module";
import { usePathname } from "next/navigation";

const HomeMenu = ({ collection }: { collection: TypeCollection[] }) => {
  const pathname = usePathname();

  return (
    <Fragment>
      <Link
        href={"/"}
        className={`${styles.list} `}
        style={{ color: pathname !== "/" ? "black" : "" }}
        scroll={false}
      >
        Beranda
      </Link>
      <Link
        href={"/produk"}
        className={styles.list}
        style={{ color: pathname !== "/" ? "black" : "" }}
        scroll={false}
      >
        produk
      </Link>
      {collection.map((item: TypeCollection) => (
        <Link
          href={`/product/${item.slug}`}
          className={styles.list}
          key={item._id}
          style={{ color: pathname !== "/" ? "black" : "" }}
          scroll={false}
        >
          {item.name}
        </Link>
      ))}
      <Link
        href={"/product"}
        className={styles.list}
        style={{ color: pathname !== "/" ? "black" : "" }}
        scroll={false}
      >
        Tentang
      </Link>
      <Link
        href={"/product"}
        className={styles.list}
        style={{ color: pathname !== "/" ? "black" : "" }}
        scroll={false}
      >
        Kontak
      </Link>
    </Fragment>
  );
};

export default HomeMenu;
