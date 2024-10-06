import React, { useState } from "react";
import styles from "./shipping.module.scss";
import { AlertCircle } from "lucide-react";
import ModalAddShipping from "./ModalAddShipping";

const ShippingView = () => {
  const [isAdd, setIsAdd] = useState(false);

  console.log(isAdd);
  return (
    <div className={styles.wrapper}>
      <h3>Alamat Pengiriman</h3>
      <p>
        <AlertCircle width={18} height={18} /> Alamat Pengiriman anda masih
        kosong
      </p>

      <button
        type="button"
        aria-label="tambah alamat"
        onClick={() => setIsAdd(true)}
      >
        Tambah
      </button>
      <ModalAddShipping onClose={() => setIsAdd(false)} />
    </div>
  );
};

export default ShippingView;
