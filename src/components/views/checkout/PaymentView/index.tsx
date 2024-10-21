import React from "react";
import styles from "./payment.module.scss";

import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setError, setPayment } from "@/store/slices/chechkoutSlice";

const payment = [
  { name: "bca", img: "/payment/bca.png" },
  { name: "bni", img: "/payment/bni.png" },
  { name: "bri", img: "/payment/bri.png" },
  { name: "mandiri bill", img: "/payment/mandiri.png" },
];

const PaymentView = () => {
  const dispatch = useAppDispatch();
  const {
    payment: selected,
    loading,
    errorSubmit,
  } = useAppSelector((state) => state.check);

  return (
    <div
      className={`${styles.wrapper}`}
      style={{ border: errorSubmit.payment ? "1px solid red" : "" }}
    >
      <h3 style={{ color: errorSubmit.payment ? "red" : "" }}>
        Metode Pembayaran
      </h3>

      <div className={styles.row}>
        <h4>Transfer Bank</h4>
        <div className={styles.bank}>
          {loading &&
            payment.map((item) => (
              <div key={item.name} className={styles.skeleton}></div>
            ))}
          {!loading &&
            payment.map((item) => (
              <button
                key={item.name}
                className={styles.bank__list}
                title={item.name}
                onClick={() => {
                  dispatch(setPayment(item.name));
                  dispatch(setError({ payment: "" }));
                }}
                style={{
                  borderColor: selected === item.name ? "blue" : "",
                }}
              >
                <Image
                  src={item.img}
                  alt={item.name}
                  width={100}
                  height={100}
                  priority
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
