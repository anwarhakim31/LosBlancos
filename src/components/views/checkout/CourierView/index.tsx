import React from "react";
import styles from "./courier.module.scss";
import { useAppSelector } from "@/store/hook";
import { AlertCircle } from "lucide-react";
import { formatCurrency } from "@/utils/contant";

const CourierView = () => {
  const { address } = useAppSelector((state) => state.check);

  return (
    <div
      className={`${styles.wrapper} ${
        address ? styles.select : styles.noselect
      }`}
    >
      <h3>Opsi Jasa Pengiriman</h3>
      <div className={styles.container}>
        {!address && (
          <span>
            <AlertCircle width={18} height={18} /> Alamat Pengiriman anda masih
            kosong
          </span>
        )}
        <div className={styles.courier}>
          <h4>JNE</h4>
          <p> JNE REGULER</p>
        </div>
        <h4 className={styles.cost}>{formatCurrency(200000)}</h4>
      </div>
      <div className={styles.footer}></div>
    </div>
  );
};

export default CourierView;
