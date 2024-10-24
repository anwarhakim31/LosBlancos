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
import ModalCancelPayment from "@/components/views/payment/ModalCancelPayment";
import { useRouter } from "next/navigation";
import ModalRebuy from "@/components/views/payment/ModalRebuy";

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
  const [isCancel, setIsCancel] = useState(false);
  const [isRebuy, setIsRebuy] = useState(false);
  const [diffrent, setDiffrent] = useState(false);
  const { replace } = useRouter();

  useEffect(() => {
    async function getData() {
      try {
        const res = await transactionService.get(id);

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

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await transactionService.cekStatus(data?.invoice as string);

        if (res.status === 200 && res.data.data.paymentStatus === "dibayar") {
          replace("/pembayaran/sukses");
        }
      } catch (error) {
        ResponseError(error);
      }
    };
    if (!loading && data?.invoice) {
      const interval = setInterval(() => {
        getStatus();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [loading, data?.invoice, replace]);

  const handleRebuy = async () => {
    try {
      const res = await transactionService.cekStock(data?.invoice as string);

      if (res.status === 200) {
        setIsRebuy(true);
        setDiffrent(res.data.diffrent);
      }
    } catch (error) {
      ResponseError(error);
    }
  };

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <BreadCrubm />
          <h1>Pembayaran</h1>
          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.detail}>
                <div
                  className={styles.virtual_account}
                  style={{ pointerEvents: countdown === 0 ? "none" : "auto" }}
                >
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
                      disabled={
                        loading || !data?.paymentCode || countdown === 0
                      }
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
              <button
                className={styles.button}
                type="button"
                disabled={loading}
                aria-label="Batalkan"
                style={{ marginTop: "2rem", marginLeft: "auto" }}
                onClick={() => setIsCancel(true)}
              >
                {loading ? "loading" : countdown === 0 ? "Kembali" : "Batalkan"}
              </button>
            </div>
          </div>
        </section>
        {isChange && (
          <ModalChangePayment
            onClose={() => setIsChange(false)}
            invoice={data?.invoice as string}
          />
        )}
        {isCancel && (
          <ModalCancelPayment
            onClose={() => setIsCancel(false)}
            invoice={data?.invoice as string}
          />
        )}
        {isRebuy && (
          <ModalRebuy
            onClose={() => setIsRebuy(false)}
            invoice={data?.invoice as string}
            diffrent={diffrent}
          />
        )}
      </main>
      <Footer />
    </Fragment>
  );
};

export default PembaranPage;
