import ButtonBackPage from "@/components/element/ButtonBackPage";
import styles from "./transaction.module.scss";
import { formatCurrency, formateDate, ServerURL } from "@/utils/contant";
import React from "react";
import { Check, X } from "lucide-react";
import { TypeTransaction } from "@/services/type.module";
import Image from "next/image";

const getData = async (id: string) => {
  const res = await fetch(`${ServerURL}/transaction/admin/` + id, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data.transaction;
};

const TranscationId = async ({
  params,
}: {
  params: { transactionId: string };
}) => {
  const { transactionId } = params;

  const transaction: TypeTransaction = await getData(transactionId);

  console.log(transaction);

  return (
    <section>
      <ButtonBackPage />
      <div className={styles.container}>
        <div>
          <div className={styles.info + " " + styles.box}>
            <h3>Detail Transaksi</h3>
            <div
              className={`${styles.rounded} ${
                transaction.paymentStatus === "sukses"
                  ? styles.success
                  : styles.failed
              }`}
            >
              <div
                className={`${styles.rounded2} ${
                  transaction.paymentStatus === "sukses"
                    ? styles.success
                    : styles.failed
                }`}
              >
                <div
                  className={`${styles.icon} ${
                    transaction.paymentStatus === "sukses"
                      ? styles.success
                      : styles.failed
                  }`}
                >
                  {transaction.paymentStatus !== "dibayar" ? <X /> : <Check />}
                </div>
              </div>
            </div>
            <div className={styles.wrapper}>
              <p>Invoice</p>
              <span>: {transaction.invoice}</span>
            </div>
            <div className={styles.wrapper}>
              <p>Transaksi dibuat</p>
              <span>: {formateDate(transaction.transactionDate)}</span>
            </div>
            <div className={styles.wrapper}>
              <p>status transaksi</p>
              <span>: {transaction.transactionStatus}</span>
            </div>
            <div className={styles.wrapper}>
              <p>status Pembayaran</p>
              <span>: {transaction?.paymentStatus}</span>
            </div>
            <div className={styles.wrapper}>
              <p>metode Pembayaran</p>
              <span>: {transaction?.paymentName}</span>
            </div>
            <div className={styles.wrapper}>
              <p>pembayaran dibuat</p>
              <span>
                :{" "}
                {transaction?.paymentCreated &&
                  formateDate(transaction?.paymentCreated)}
              </span>
            </div>
          </div>
          <div className={styles.box + " " + styles.total}>
            <div className={styles.wrapper}>
              <p>SubTotal</p>
              <span>: {formatCurrency(transaction?.subtotal)}</span>
            </div>
            <div className={styles.wrapper}>
              <p>Biaya Pengiriman</p>
              <span>: {formatCurrency(transaction?.shippingCost)}</span>
            </div>
            <div className={styles.wrapper}>
              <p>Biaya Admin</p>
              <span>: {formatCurrency(1000)}</span>
            </div>
            <div className={styles.wrapper}>
              <p>Diskon</p>
              <span>: -</span>
            </div>
            <h2>
              Total Transaksi : {formatCurrency(transaction.totalPayment)}
            </h2>
          </div>
        </div>
        <div>
          <div className={styles.box} style={{ marginBottom: "2rem" }}>
            <h3>Akun Pelanggan</h3>
            <div className={styles.wrapper}>
              <p>Nama Lengkap</p>
              <span>: {transaction?.userId.fullname}</span>
            </div>
            <div className={styles.wrapper}>
              <p>Email</p>
              <span>: {transaction?.userId.email}</span>
            </div>
            <div className={styles.wrapper}>
              <p>No. Telepon</p>
              <span>: {transaction?.userId.phone}</span>
            </div>
            <div className={styles.wrapper}>
              <p>Jenis Kelamin</p>
              <span>: {transaction?.userId?.gender}</span>
            </div>
          </div>
          <div className={styles.box}>
            <h3>Detail Pengiriman</h3>
            <div className={styles.wrapper}>
              <p>Nama Penerima</p>
              <span>: {transaction?.shippingAddress?.fullname}</span>
            </div>
            <div className={styles.wrapper}>
              <p>No. Telepon</p>
              <span>: {transaction?.shippingAddress?.phone}</span>
            </div>
            <div className={styles.wrapper}>
              <p>alamat</p>
              <span>: {transaction?.shippingAddress?.address}</span>
            </div>
            <div className={styles.wrapper}>
              <p>kecamatan</p>
              <span>: {transaction?.shippingAddress?.subdistrict}</span>
            </div>
            <div className={styles.wrapper}>
              <p>kota</p>
              <span>: {transaction?.shippingAddress?.city}</span>
            </div>
            <div className={styles.wrapper}>
              <p>provinsi</p>
              <span>: {transaction?.shippingAddress?.province}</span>
            </div>
            <div className={styles.wrapper}>
              <p>kode pos</p>
              <span>: {transaction?.shippingAddress?.postalCode}</span>
            </div>
            <div className={styles.wrapper}>
              <p>Metode Pengiriman</p>
              <span>: {transaction?.shippingName}</span>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.box}>
            <h3>Detail Pesanan</h3>
            <div className={styles.produk}>
              {transaction?.items?.map((item, index) => (
                <div className={styles.list} key={index}>
                  <div className={styles.list__img}>
                    <Image
                      src={item?.productId?.image[0]}
                      alt={item?.productId?.name}
                      width={100}
                      height={100}
                      quality={100}
                      priority
                    />
                  </div>
                  <div className={styles.list__info}>
                    <span>{item?.productId?.collectionName?.name}</span>
                    <h4>{item?.productId?.name}</h4>
                    <p>
                      {item.atribute} {item.atributeValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.box + " " + styles.totalMobile}>
              <div className={styles.wrapper}>
                <p>SubTotal</p>
                <span>: {formatCurrency(transaction?.subtotal)}</span>
              </div>
              <div className={styles.wrapper}>
                <p>Biaya Pengiriman</p>
                <span>: {formatCurrency(transaction?.shippingCost)}</span>
              </div>
              <div className={styles.wrapper}>
                <p>Biaya Admin</p>
                <span>: {formatCurrency(1000)}</span>
              </div>
              <div className={styles.wrapper}>
                <p>Diskon</p>
                <span>: -</span>
              </div>
              <h2>
                Total Transaksi : {formatCurrency(transaction.totalPayment)}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TranscationId;
