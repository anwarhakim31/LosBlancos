"use client";

import BreadCrubm from "@/components/element/BreadCrubm";
import styles from "./detail.module.scss";

import { TypeProduct } from "@/services/type.module";

import DetailImageView from "../DetailImageView";
import DetailInfoView from "../DetailInfoView";
import { useState } from "react";

const navigation = ["description", "review"];

const DetailProductView = ({ product }: { product: TypeProduct }) => {
  const [isSelect, setIsSelect] = useState("description");

  return (
    <section className={styles.container}>
      <BreadCrubm />
      <div className={styles.wrapper}>
        <DetailImageView product={product} />
        <DetailInfoView product={product} />
      </div>
      <div className={styles.footer}>
        <div className={styles.footer__navigation}>
          {navigation.map((item, index) => (
            <button
              key={index}
              className={isSelect === item ? styles.active : ""}
              onClick={() => setIsSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className={styles.footer__description}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </section>
  );
};

export default DetailProductView;
