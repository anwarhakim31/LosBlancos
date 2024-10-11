"use client";

import { usePathname } from "next/navigation";
import styles from "./detail.module.scss";

const DetailProductView = () => {
  const pathname = usePathname();

  const path = pathname.split("/");
  //   const id = path[path.length - 1];

  console.log(path);

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}></div>
    </section>
  );
};

export default DetailProductView;
