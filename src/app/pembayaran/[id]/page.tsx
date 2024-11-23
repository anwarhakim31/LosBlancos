"use client";

import { transactionService } from "@/services/transaction/method";
import { TypeReview, TypeTransaction } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./payment.module.scss";

import BreadCrubm from "@/components/element/BreadCrubm";
import ModalChangePayment from "@/components/views/payment/ModalChangePayment";
import ModalCancelPayment from "@/components/views/payment/ModalCancelPayment";
import { useRouter, useSearchParams } from "next/navigation";
import ModalRebuy from "@/components/views/payment/ModalRebuy";
import StatusView from "@/components/views/payment/statusView";
import { reviewService } from "@/services/review/method";

import InformationView from "@/components/views/payment/InformationView";
import PayView from "@/components/views/payment/payView";

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
  const [review, setReview] = useState<TypeReview[]>([]);
  const [actions, setActions] = useState<{ name: string; url: string }[]>([]);
  const { replace } = useRouter();
  const status = useSearchParams().get("status");

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
        {status ? (
          <StatusView data={data} review={review} setReview={setReview} />
        ) : (
          <section className={styles.container}>
            <BreadCrubm />
            <h1>Pembayaran</h1>
            <div className={styles.content}>
              <PayView
                data={data as TypeTransaction}
                actions={actions}
                loading={loading}
                countdown={countdown as number}
                setIsChange={setIsChange}
                handleRebuy={handleRebuy}
              />
              <InformationView
                loading={loading}
                data={data as TypeTransaction}
                setIsCancel={setIsCancel}
                countdown={countdown as number}
              />
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
