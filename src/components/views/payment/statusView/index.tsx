"use client";
import styles from "./status.module.scss";
import { Check, Home } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  itemTypeTransaction,
  TypeReview,
  TypeTransaction,
} from "@/services/type.module";
import { formatCurrency, formateDate } from "@/utils/contant";
import { useState } from "react";
import ModalReview from "./ModalReview";

const methodPayment = (method: string) => {
  switch (method) {
    case "bca":
      return "Transfer Bank - BCA";
    case "mandiri bill":
      return "Transfer Bank - Mandiri ";
    case "bni":
      return "Transfer Bank - BNI";
    case "bri":
      return "Transfer Bank - BRI";
    default:
      return "";
  }
};

const StatusView = ({ data }: { data: TypeTransaction | null }) => {
  const status = useSearchParams().get("status") as string;
  const [review, setReview] = useState<TypeReview[]>([]);
  const [isDataReview, setIsDataReview] = useState<itemTypeTransaction | null>(
    null
  );

  const handleAddReview = (item: TypeReview) => {
    setReview((prev) => [...prev, { ...item }]);
  };

  const handleClose = () => {
    setIsDataReview(null);
  };

  console.log(review);

  return (
    <>
      {!data ? (
        <div className={styles.loaderWrapper}>
          <div className={styles.loader}></div>
          <p>Loading</p>
        </div>
      ) : (
        <section className={styles.container}>
          <div className={styles.content}>
            <div
              className={`${styles.rounded} ${
                status === "sukses" ? styles.success : styles.failed
              }`}
            >
              <div
                className={`${styles.rounded2} ${
                  status === "sukses" ? styles.success : styles.failed
                }`}
              >
                <div
                  className={`${styles.icon} ${
                    status === "sukses" ? styles.success : styles.failed
                  }`}
                >
                  <Check />
                </div>
              </div>
            </div>
            <h1 className={styles.status}>
              Pembayaran {status === "sukses" ? "Berhasil" : "Gagal"}!
            </h1>
            <p className={styles.desc}>
              Transaksi anda {status === "sukses" ? "berhasil" : "gagal"} di
              bayar! <br />
              {data?.paymentStatus === "dibayar" &&
                "Kami sedang memproses pesanan anda."}
              {data?.paymentStatus === "kadaluwarsa" &&
                "Waktu pembayaran telah habis."}
              {data?.paymentStatus === "ditolak" && "Pembayaran anda ditolak."}
              {data?.paymentStatus === "dibatalkan" &&
                "Pembayaran anda dibatalkan."}
            </p>
            <div className={styles.transaction}>
              <div className={styles.transaction__order}>
                {data?.items?.map((item) => (
                  <div
                    key={item._id}
                    className={styles.transaction__order__item}
                  >
                    <div className={styles.transaction__order__item__image}>
                      <Image
                        src={item.productId.image[0] || "/default.png"}
                        alt={item.productId.name}
                        width={100}
                        height={100}
                      />
                    </div>

                    <div className={styles.transaction__order__item__detail}>
                      <div>
                        <h3>{item.productId.name}</h3>
                        <p>
                          {item.atribute} {item.atributeValue}
                        </p>
                      </div>
                      <div
                        className={
                          styles.transaction__order__item__detail__footer
                        }
                      >
                        <span>
                          {item.quantity} x {item.productId.price}
                        </span>
                        <button
                          type="button"
                          aria-label={`ulasan ${item.productId.name}`}
                          onClick={() => setIsDataReview(item)}
                        >
                          buat Ulasan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.transaction__info}>
                <div className={styles.transaction__info__wrapper}>
                  <p>No. Transaksi</p>
                  <span>{data.invoice}</span>
                </div>
                <div className={styles.transaction__info__wrapper}>
                  <p>Tanggal Transaksi</p>
                  <span>{formateDate(data?.paymentCreated as Date)}</span>
                </div>
                <div className={styles.transaction__info__wrapper}>
                  <p>Metode Pembayaran</p>
                  <span>{methodPayment(data.paymentName as string)}</span>
                </div>
                <div className={styles.transaction__info__wrapper}>
                  <p>Opsi Pengiriman </p>
                  <span>{data.shippingName} </span>
                </div>

                <div className={styles.transaction__info__wrapper}>
                  <p>Subtotal </p>
                  <span>{formatCurrency(data.subtotal)} </span>
                </div>
                <div className={styles.transaction__info__wrapper}>
                  <p>Biaya Admin </p>
                  <span>{formatCurrency(1000)} </span>
                </div>
                <div className={styles.transaction__info__wrapper}>
                  <p>Biaya Pengiriman </p>
                  <span>{formatCurrency(data.shippingCost)} </span>
                </div>
                <div className={styles.transaction__info__wrapper}>
                  <p>Total </p>
                  <span>
                    {formatCurrency(data.subtotal + data.shippingCost + 1000)}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/" className={styles.btn}>
              <Home />
            </Link>
          </div>
        </section>
      )}
      {isDataReview && (
        <ModalReview
          onClose={handleClose}
          data={isDataReview}
          invoice={data?.invoice as string}
          handleAddReview={handleAddReview}
        />
      )}
    </>
  );
};

export default StatusView;
