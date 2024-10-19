import React, { useState } from "react";
import styles from "./courier.module.scss";
import { useAppSelector } from "@/store/hook";
import { AlertCircle, ArrowRightLeft } from "lucide-react";
import { formatCurrency } from "@/utils/contant";
import Image from "next/image";
import ModalChangeOngkir from "./ModalChangeOngkir";

export function splitEstimated(est: string) {
  return est?.split("hari")[0];
}

const CourierView = () => {
  const { address, costs } = useAppSelector((state) => state.check);
  const [isChange, setIsChange] = useState(false);

  return (
    <div
      className={`${styles.wrapper} ${
        address ? styles.select : styles.noselect
      }`}
      onClick={() => setIsChange(true)}
    >
      <h3>Jasa Pengiriman</h3>
      <div className={styles.container}>
        {!address && (
          <span>
            <AlertCircle width={18} height={18} /> Alamat Pengiriman anda masih
            kosong
          </span>
        )}
        <div className={styles.courier}>
          <h4>{costs?.courier}</h4>
          <p>{costs?.service.split("Pos")}</p>
        </div>
        <h4 className={styles.cost}>
          {formatCurrency((costs?.cost[0].value as number) || 0)}
        </h4>
      </div>
      <div className={styles.footer}>
        <Image src="/truck.png" alt="courier" width={30} height={18} />
        <p>
          Estimasi tiba{" "}
          {costs?.cost[0].etd.startsWith("0")
            ? "ini"
            : costs?.cost[0].etd.split("HARI")}{" "}
          hari
        </p>
      </div>
      <button
        className={styles.switch}
        onClick={() => setIsChange(true)}
        aria-label="switch"
        title="Ganti Alamat Pengiriman"
        style={{
          display: address ? "block" : "none",
        }}
      >
        <ArrowRightLeft />
      </button>

      {isChange && <ModalChangeOngkir onClose={() => setIsChange(false)} />}
    </div>
  );
};

export default CourierView;
