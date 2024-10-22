"use client";
import Footer from "@/components/layouts/Footer";
import { transactionService } from "@/services/transaction/method";
import { TypeTransaction } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./payment.module.scss";
import { Banknote, Copy, Timer, X } from "lucide-react";
import { toast } from "sonner";
import {
  formatCountdown,
  formatCurrency,
  formateDate,
  formatTime,
} from "@/utils/contant";
import Image from "next/image";

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

  const [data, setData] = useState<TypeTransaction | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const res = await transactionService.get(
          id,
          session.data?.user?.id as string
        );

        if (res.status === 200) {
          setData(res.data.transaction);
        }
      } catch (error) {
        ResponseError(error);
      }
    }

    if (id && session.data?.user?.id) {
      getData();
    }
  }, [id, session.data?.user?.id]);

  useEffect(() => {
    if (data?.paymentCreated && data?.paymentExpired) {
      // const paymentExpiredDate = new Date(data.paymentExpired);
      const nows = new Date();
      const paymentExpiredDate = new Date(nows.getTime() + 60 * 60 * 1);

      const updateCountdown = () => {
        const now = new Date();

        const timeRemaining = paymentExpiredDate.getTime() - now.getTime();
        if (timeRemaining > 0) {
          setCountdown(timeRemaining);
        } else {
          setCountdown(0);
        }
      };

      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  }, [data?.paymentCreated, data?.paymentExpired]);

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <h1>Pembayaran</h1>
          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.detail}>
                <div className={styles.virtual_account}>
                  <h3>Nomor Virtual Account</h3>
                  <div className={styles.number}>
                    <h2>{data?.paymentCode}</h2>
                    <button
                      type="button"
                      className={styles.copy}
                      onClick={() =>
                        navigator.clipboard
                          .writeText(data?.paymentCode as string)
                          .then(() => toast.success("Berhasil menyalin"))
                      }
                      title="salin"
                    >
                      <Copy />
                    </button>
                  </div>
                </div>
                <div className={styles.wrapper}>
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
                  <div className={styles.total}>
                    <div className={styles.money}>
                      <div className={styles.money__icon}>
                        <Banknote />
                      </div>
                    </div>
                    <p>Total Pembayaran :</p>
                    <span>
                      {formatCurrency((data?.totalPayment as number) || 0)}
                    </span>
                  </div>
                </div>
                <div className={styles.footer}>
                  <h3>Pembayaran melalui </h3>
                  <div className={styles.footer__image}>
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
                </div>
              </div>

              <div className={styles.transaction}>
                <div className={styles.wrapper}>
                  <p>Status Transaksi </p>
                  <div className={styles.status}>
                    <span>Tertunda</span>
                  </div>
                </div>
                <div className={styles.wrapper}>
                  <p>No. Transaksi </p>
                  <p>{data?.invoice}</p>
                </div>
                <div className={styles.wrapper}>
                  <p>Waktu Transaksi </p>
                  <p>
                    {formateDate(data?.paymentCreated as Date)} -{" "}
                    {formatTime(data?.paymentCreated as Date)}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.right}></div>
          </div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default PembaranPage;
