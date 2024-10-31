import React from "react";
import styles from "./payment.module.scss";

import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setError, setPayment } from "@/store/slices/chechkoutSlice";

const bank = [
  { name: "bca", img: "/payment/bca.png" },
  { name: "bni", img: "/payment/bni.png" },
  { name: "bri", img: "/payment/bri.png" },
  { name: "mandiri bill", img: "/payment/mandiri.png" },
];

const counter = [
  { name: "indomaret", img: "/payment/indomaret.png" },
  { name: "alfamart", img: "/payment/alfamart.png" },
];

const wallet = [
  { name: "shopeepay", img: "/payment/spay.png" },
  { name: "gopay", img: "/payment/gopay.png" },
];

const PaymentView = ({ isLoading }: { isLoading: boolean }) => {
  const dispatch = useAppDispatch();
  const {
    payment: selected,
    loading,
    errorSubmit,
  } = useAppSelector((state) => state.check);

  return (
    <div
      className={`${styles.wrapper}`}
      style={{
        border: errorSubmit.payment ? "1px solid red" : "",
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      <h3 style={{ color: errorSubmit.payment ? "red" : "" }}>
        Metode Pembayaran
      </h3>

      <div className={styles.row}>
        <h4>Transfer Bank</h4>
        <div className={styles.pay}>
          {loading &&
            bank.map((item) => (
              <div key={item.name} className={styles.skeleton}></div>
            ))}
          {!loading &&
            bank.map((item) => (
              <button
                key={item.name}
                className={styles.pay__list}
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
        <h4>E-Wallet</h4>
        <div className={styles.pay}>
          {loading &&
            wallet.map((item) => (
              <div key={item.name} className={styles.skeleton}></div>
            ))}
          {!loading &&
            wallet.map((item) => (
              <button
                key={item.name}
                className={styles.pay__list}
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
        <h4>Over the Counter</h4>
        <div className={styles.pay}>
          {loading &&
            counter.map((item) => (
              <div key={item.name} className={styles.skeleton}></div>
            ))}
          {!loading &&
            counter.map((item) => (
              <button
                key={item.name}
                className={styles.pay__list}
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
        <h4>QRIS</h4>
        <div className={styles.pay}>
          {loading && <div key={"qris"} className={styles.skeleton}></div>}
          {!loading && (
            <button
              key={"qris"}
              className={styles.pay__list}
              title={"qris"}
              onClick={() => {
                dispatch(setPayment("qris"));
                dispatch(setError({ payment: "" }));
              }}
              style={{
                borderColor: selected === "qris" ? "blue" : "",
              }}
            >
              <Image
                src={"/payment/qris.png"}
                alt={"qris"}
                width={100}
                height={100}
                priority
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
