import React from "react";
import styles from "./pay.module.scss";
import { Banknote, Copy, Timer, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import {
  formatCountdown,
  formatCurrency,
  formateDate,
  formatTime,
} from "@/utils/contant";
import Image from "next/image";
import Link from "next/link";
import { TypeTransaction } from "@/services/type.module";

const payment = [
  {
    id: 1,
    name: "bca",
    image: "/payment/bca.png",
  },
  {
    id: 2,
    name: "bri",
    image: "/payment/bri.png",
  },
  {
    id: 3,
    name: "bni",
    image: "/payment/bni.png",
  },
  {
    id: 4,
    name: "mandiri bill",
    image: "/payment/mandiri.png",
  },
  {
    id: 5,
    name: "alfamart",
    image: "/payment/alfamart.png",
  },
  {
    id: 6,
    name: "indomaret",
    image: "/payment/indomaret.png",
  },
  {
    id: 7,
    name: "shopeepay",
    image: "/payment/spay.png",
  },
  {
    id: 8,
    name: "gopay",
    image: "/payment/gopay.png",
  },
  {
    id: 9,
    name: "qris",
    image: "/payment/qris.png",
  },
];

function getBankDetail(name: string) {
  return payment.find((item) => item.name === name);
}

interface PropsType {
  data?: TypeTransaction;
  actions: { name: string; url: string }[];
  loading?: boolean;
  countdown?: number;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  handleRebuy: () => void;
}

const PayView: React.FC<PropsType> = ({
  data,
  actions,
  loading,
  countdown,
  setIsChange,
  handleRebuy,
}) => {
  return (
    <div className={styles.left}>
      <div className={styles.detail}>
        {loading ? (
          <>
            <div
              className={styles.skeleton}
              style={{ maxWidth: "210px", height: "1.75rem" }}
            ></div>
            <div
              className={styles.skeleton}
              style={{ marginBlock: "1rem", height: "3.5rem" }}
            ></div>
          </>
        ) : data?.paymentName === "shopeepay" ||
          data?.paymentName === "gopay" ? (
          <>
            <h3>Bayar Sekarang </h3>
            <Link
              href={
                actions?.find((item) => item.name === "deeplink-redirect")
                  ?.url as string
              }
              className={styles.ewallet}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon />
              Koneksi dengan {data?.paymentName}
            </Link>
          </>
        ) : data?.paymentName === "qris" ? (
          <>
            <h3>Scan QR Code </h3>
            <div className={styles.qrcode}>
              <Image
                src={actions[0].url as string}
                alt="qrcode"
                width={200}
                height={200}
                priority
              />
            </div>
          </>
        ) : (
          <div
            className={styles.virtual_account}
            style={{
              pointerEvents: countdown === 0 ? "none" : "auto",
            }}
          >
            <h3>
              {data?.paymentMethod === "bank_transfer"
                ? "Nomor Virtual Account"
                : "Nomor Pembayaran"}
            </h3>
            {
              <div className={styles.number}>
                <h2>{data?.paymentCode}</h2>

                <button
                  type="button"
                  className={styles.copy}
                  disabled={loading || !data?.paymentCode || countdown === 0}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(data?.paymentCode as string)
                      .then(() => {
                        const timeout = setTimeout(
                          () => toast.success("Berhasil menyalin"),
                          1000
                        );

                        return () => clearTimeout(timeout);
                      })
                  }
                  title="salin"
                >
                  <Copy />
                </button>
              </div>
            }
          </div>
        )}

        <div className={styles.wrapper}>
          {loading ? (
            <div
              className={styles.skeleton}
              style={{ maxWidth: "230px", height: "2.25rem" }}
            ></div>
          ) : (
            <>
              {" "}
              <div className={styles.countdown}>
                {countdown && countdown > 0 ? (
                  <>
                    <div className={styles.time}>
                      <div className={styles.time__icon}>
                        <Timer />
                      </div>
                    </div>
                    <p>Batas Waktu Bayar :</p>
                    <span>{formatCountdown(countdown as number)}</span>
                  </>
                ) : (
                  <>
                    <div className={styles.time_expired}>
                      <div className={styles.time_expired__icon}>
                        <X />
                      </div>
                    </div>
                    <p>Waktu Pembayaran Habis</p>
                  </>
                )}
              </div>
            </>
          )}
          <div className={styles.total}>
            {loading ? (
              <div
                className={styles.skeleton}
                style={{ width: "230px", height: "2.25rem" }}
              ></div>
            ) : (
              <>
                <div className={styles.money}>
                  <div className={styles.money__icon}>
                    <Banknote />
                  </div>
                </div>
                <p>Total Pembayaran :</p>
                <span>
                  {formatCurrency((data?.totalPayment as number) || 0)}
                </span>
              </>
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.wrapper}>
            {loading ? (
              <>
                <div
                  className={styles.skeleton}
                  style={{ width: "100px", height: "1.25rem" }}
                ></div>
                <div className={styles.skeleton_payment}></div>
              </>
            ) : (
              <>
                <h4>Pembayaran melalui </h4>
                <div className={styles.wrapper__image}>
                  <Image
                    src={
                      getBankDetail(data?.paymentName as string)?.image ||
                      "/default.png"
                    }
                    alt="logo"
                    width={100}
                    height={100}
                  />
                </div>
              </>
            )}
          </div>

          <button
            className={styles.button}
            type="button"
            disabled={loading}
            aria-label="Ganti pembayaran"
            onClick={() =>
              countdown === 0 ? handleRebuy() : setIsChange(true)
            }
          >
            {loading
              ? "loading"
              : countdown === 0
              ? "Beli Lagi"
              : "Ganti Pembayaran"}
          </button>
        </div>
      </div>

      <div className={styles.transaction}>
        <div className={styles.wrapper}>
          {loading ? (
            <>
              <div
                className={styles.skeleton}
                style={{
                  maxWidth: "110px",
                  height: "1.5rem",
                  marginRight: "50px",
                }}
              ></div>
              <div
                className={styles.skeleton}
                style={{ maxWidth: "150px", height: "1.5rem" }}
              ></div>
            </>
          ) : (
            <>
              <p>Status Transaksi </p>
              <div className={styles.status}>
                <span>{countdown === 0 ? "dibatalkan" : "Belum Dibayar"}</span>
              </div>
            </>
          )}
        </div>
        <div className={styles.wrapper}>
          {loading ? (
            <>
              <div
                className={styles.skeleton}
                style={{
                  maxWidth: "110px",
                  height: "1.5rem",
                  marginRight: "50px",
                }}
              ></div>
              <div
                className={styles.skeleton}
                style={{ maxWidth: "150px", height: "1.5rem" }}
              ></div>
            </>
          ) : (
            <>
              <p>No. Transaksi </p>
              <p>{data?.invoice}</p>
            </>
          )}
        </div>
        <div className={styles.wrapper}>
          {loading ? (
            <>
              <div
                className={styles.skeleton}
                style={{
                  maxWidth: "110px",
                  height: "1.5rem",
                  marginRight: "50px",
                }}
              ></div>
              <div
                className={styles.skeleton}
                style={{ maxWidth: "150px", height: "1.5rem" }}
              ></div>
            </>
          ) : (
            <>
              <p>Waktu Transaksi </p>
              <p>
                {formateDate(data?.paymentCreated as Date)} -{" "}
                {formatTime(data?.paymentCreated as Date)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayView;
