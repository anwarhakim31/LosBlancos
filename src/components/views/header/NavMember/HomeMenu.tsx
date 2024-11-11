import React, { Fragment } from "react";
import styles from "./homemenu.module.scss";
import Link from "next/link";
import { TypeCollection } from "@/services/type.module";
import { usePathname } from "next/navigation";
import { PT_Sans } from "next/font/google";

const font = PT_Sans({ weight: "400", subsets: ["latin"] });

const HomeMenu = ({ collection }: { collection: TypeCollection[] }) => {
  const pathname = usePathname();

  return (
    <Fragment>
      <Link
        href={"/"}
        className={`${styles.list}  ${font.className}`}
        style={{ color: pathname !== "/" ? "black" : "" }}
      >
        Beranda
      </Link>
      <Link
        href={"/produk"}
        className={`${styles.list}  ${font.className}`}
        style={{ color: pathname !== "/" ? "black" : "" }}
      >
        produk
      </Link>
      {collection.map((item: TypeCollection) => (
        <Link
          href={`/produk/${item.slug}`}
          className={`${styles.list}  ${font.className}`}
          key={item._id}
          style={{ color: pathname !== "/" ? "black" : "" }}
        >
          {item.name}
        </Link>
      ))}
      <Link
        href={"/tentang"}
        className={`${styles.list}  ${font.className}`}
        style={{ color: pathname !== "/" ? "black" : "" }}
      >
        Tentang
      </Link>
    </Fragment>
  );
};

export default HomeMenu;
