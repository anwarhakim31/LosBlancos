"use client";

import { transactionService } from "@/services/transaction/method";
import { TypeReview, TypeTransaction } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./payment.module.scss";
import {
  AlertCircle,
  Banknote,
  Copy,
  Timer,
  X,
  Link as LinkIcon,
} from "lucide-react";
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
import { useRouter, useSearchParams } from "next/navigation";
import ModalRebuy from "@/components/views/payment/ModalRebuy";
import StatusView from "@/components/views/payment/statusView";
import { reviewService } from "@/services/review/method";
import Link from "next/link";
import { resetCheckout } from "@/store/slices/chechkoutSlice";
import { useAppDispatch } from "@/store/hook";

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

const PembaranPage = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TypeTransaction | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isChange, setIsChange] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isRebuy, setIsRebuy] = useState(false);
  const [diffrent, setDiffrent] = useState(false);
  const [review, setReview] = useState<TypeReview[]>([]);
  const [actions, setActions] = useState<{ name: string; url: string }[]>([]);
  const { replace } = useRouter();
  const status = useSearchParams().get("status");

  useEffect(() => {
    dispatch(resetCheckout());
  }, [dispatch]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await transactionService.get(id);

        if (res.status === 200) {
          const transactionData = res.data.transaction;
          setActions(res.data.action);
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
            if (
              newTimeRemaining > 0 &&
              transactionData?.paymentStatus === "tertunda"
            ) {
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
  }, [id, session.data?.user?.id, replace]);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await transactionService.cekStatus(data?.invoice as string);

        if (
          data &&
          res.status === 200 &&
          res.data.data.paymentStatus === "dibayar"
        ) {
          replace(`/pembayaran/${id}?status=sukses`);
          setData({ ...data, paymentStatus: "dibayar" });
        } else if (
          (res.status === 200 &&
            res.data.data.paymentStatus === "kadaluwarsa") ||
          res.data.data.paymentStatus === "ditolak"
        ) {
          replace(`/pembayaran/${id}?status=gagal`);
        }
      } catch (error) {
        ResponseError(error);
      }
    };

    if (!loading && data?.invoice && !status) {
      const interval = setInterval(() => {
        getStatus();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [loading, data, replace, id, status]);

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

  useEffect(() => {
    if (!status && countdown === 0 && data?.paymentStatus === "tertunda") {
      replace(`/pembayaran/${id}?status=gagal`);
      setData(
        (prev) => ({ ...prev, paymentStatus: "kadaluwarsa" } as TypeTransaction)
      );
    }
  }, [countdown, replace, id, status, data?.paymentStatus]);

  useEffect(() => {
    const getReview = async () => {
      try {
        const res = await reviewService.get(id as string);
        if (res.status === 200) {
          setReview(res.data.review);
        }
      } catch (error) {
        ResponseError(error);
      }
    };

    if (id) {
      getReview();
    }
  }, [status, id]);

  return (
    <Fragment>
      <main>
        {status ? (
          <StatusView data={data} review={review} setReview={setReview} />
        ) : (
          <section className={styles.container}>
            <BreadCrubm />
            <h1>Pembayaran</h1>
            <div className={styles.content}>
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
                          actions?.find(
                            (item) => item.name === "deeplink-redirect"
                          )?.url as string
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
                              <span>
                                {formatCountdown(countdown as number)}
                              </span>
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
                            {formatCurrency(
                              (data?.totalPayment as number) || 0
                            )}
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
                                getBankDetail(data?.paymentName as string)
                                  ?.image || "/default.png"
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
                          <span>
                            {countdown === 0 ? "dibatalkan" : "Belum Dibayar"}
                          </span>
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
              <div className={styles.right}>
                <div className={styles.info}>
                  <div className={styles.info__logo}>
                    <p>
                      Dijamin <br />
                      <span>Aman</span>
                    </p>
                  </div>
                  <AlertCircle fill="blue" color="white" />

                  <p className={styles.info__text}>
                    Transaksi ini dijamin aman
                  </p>
                </div>

                <div className={styles.note}>
                  {loading ? (
                    <>
                      <div
                        className={styles.skeleton}
                        style={{
                          height: "1.5rem",
                          width: "100px",
                          marginBottom: "1.25rem",
                        }}
                      ></div>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className={styles.skeleton}
                          style={{
                            maxWidth: "250px",
                            height: "1rem",
                            marginBottom: "0.35rem",
                          }}
                        ></div>
                      ))}
                    </>
                  ) : (
                    <>
                      <h3>Catatan</h3>
                      <ol className={styles.note__primaryList}>
                        {data?.paymentMethod === "bank_transfer" && (
                          <li>
                            Salin Nomor Transaksi untuk melakukan pembayaran
                          </li>
                        )}
                        {data?.paymentMethod === "over_thecounter" && (
                          <li>Berikan Nomor Pembayaran ke kasir</li>
                        )}
                        {data?.paymentName === "gopay" ||
                          (data?.paymentName === "shopeepay" && (
                            <li>
                              Klik Koneksi dan akan mengarahkan ke e-wallet
                              untuk pembayaran
                            </li>
                          ))}
                        {data?.paymentName === "qris" && <li>Scan QR Code </li>}
                        <li>
                          Halaman tidak perlu kamu refresh, status transaksi
                          akan update otomatis.
                        </li>
                        <li>Selesaikan pembayaran sebelum batas waktu.</li>
                        <li>Bayar sesuai nominal yang tertera</li>
                        <li>Jika perlu bantuan, chat ke WA Admin</li>
                      </ol>
                    </>
                  )}
                </div>
                <button
                  className={styles.button}
                  type="button"
                  disabled={loading}
                  aria-label="Batalkan"
                  style={{ marginTop: "2rem", marginLeft: "auto" }}
                  onClick={() => setIsCancel(true)}
                >
                  {loading
                    ? "loading"
                    : countdown === 0
                    ? "Kembali"
                    : "Batalkan"}
                </button>
              </div>
            </div>
          </section>
        )}
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
    </Fragment>
  );
};

export default PembaranPage;
