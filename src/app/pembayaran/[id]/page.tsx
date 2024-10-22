"use client";
import Footer from "@/components/layouts/Footer";
import { transactionService } from "@/services/transaction/method";
import { TypeTransaction } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./payment.module.scss";
import { AlertCircle, Banknote, Copy, Timer, X } from "lucide-react";
import { toast } from "sonner";
import {
  formatCountdown,
  formatCurrency,
  formateDate,
  formatTime,
} from "@/utils/contant";
import Image from "next/image";
import BreadCrubm from "@/components/element/BreadCrubm";
import ModalChangePayment from "@/components/views/payment/ModalChangePayment";

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
];

function getBankDetail(name: string) {
  return payment.find((item) => item.name === name);
}

const PembaranPage = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TypeTransaction | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const res = await transactionService.get(
          id,
          session.data?.user?.id as string
        );

        if (res.status === 200) {
          const transactionData = res.data.transaction;
          setData(transactionData);

          const paymentExpiredDate = new Date(transactionData?.paymentExpired);
          const now = new Date();
          const timeRemaining = paymentExpiredDate.getTime() - now.getTime();

          if (timeRemaining > 0) {
            setCountdown(timeRemaining);
          } else {
            setCountdown(0);
          }

          const interval = setInterval(() => {
            const now = new Date();
            const newTimeRemaining =
              paymentExpiredDate.getTime() - now.getTime();
            if (newTimeRemaining > 0) {
              setCountdown(newTimeRemaining);
            } else {
              setCountdown(0);
              clearInterval(interval);
            }
          }, 1000);

          return () => clearInterval(interval);
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    }

    if (id && session.data?.user?.id) {
      getData();
    }
  }, [id, session.data?.user?.id]);

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <BreadCrubm />
          <h1>Pembayaran</h1>
          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.detail}>
                <div className={styles.virtual_account}>
                  <h3>Nomor Virtual Account</h3>
                  <div className={styles.number}>
                    {loading ? (
                      <div
                        className={styles.skeleton}
                        style={{ width: "50%", height: "2.25rem" }}
                      ></div>
                    ) : (
                      <h2>{data?.paymentCode}</h2>
                    )}
                    <button
                      type="button"
                      className={styles.copy}
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
                </div>
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
                    <h3>Pembayaran melalui </h3>
                    {loading ? (
                      <div className={styles.skeleton_payment}></div>
                    ) : (
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
                    )}
                  </div>
                  <button
                    className={styles.button}
                    type="button"
                    aria-label="Ganti pembayaran"
                  >
                    Ganti Pembayaran
                  </button>
                </div>
              </div>

              <div className={styles.transaction}>
                <div className={styles.wrapper}>
                  <p>Status Transaksi </p>
                  {loading ? (
                    <div
                      className={styles.skeleton}
                      style={{ maxWidth: "200px", height: "1.5rem" }}
                    ></div>
                  ) : (
                    <div className={styles.status}>
                      <span>
                        {countdown === 0 ? "Belum Dibayar" : "Belum Diproses"}
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles.wrapper}>
                  <p>No. Transaksi </p>
                  {loading ? (
                    <div
                      className={styles.skeleton}
                      style={{ maxWidth: "200px", height: "1.5rem" }}
                    ></div>
                  ) : (
                    <p>{data?.invoice}</p>
                  )}
                </div>
                <div className={styles.wrapper}>
                  <p>Waktu Transaksi </p>
                  {loading ? (
                    <div
                      className={styles.skeleton}
                      style={{ maxWidth: "200px", height: "1.5rem" }}
                    ></div>
                  ) : (
                    <p>
                      {formateDate(data?.paymentCreated as Date)} -{" "}
                      {formatTime(data?.paymentCreated as Date)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.info}>
                <div className={styles.info__logo}>
                  <p>
                    Dijamin <br />
                    <span>Aman</span>
                  </p>
                </div>
                <AlertCircle fill="blue" color="white" />

                <p className={styles.info__text}>Transaksi ini dijamin aman</p>
              </div>

              <div className={styles.note}>
                <h3>Catatan</h3>
                <ol className={styles.note__primaryList}>
                  <li>Salin Nomor Transaksi untuk melakukan pembayaran</li>
                  <li>
                    Halaman tidak perlu kamu refresh, status transaksi akan
                    update otomatis.
                  </li>
                  <li>Selesaikan pembayaran sebelum batas waktu.</li>
                  <li>Bayar sesuai nominal yang tertera</li>
                  <li>Jika perlu bantuan, chat ke WA Admin</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        {isChange && (
          <ModalChangePayment
            onClose={() => setIsChange(false)}
            invoice={data?.invoice as string}
          />
        )}
      </main>
      <Footer />
    </Fragment>
  );
};

export default PembaranPage;
