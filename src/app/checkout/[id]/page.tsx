"use client";
import styles from "./checkout.module.scss";
import BreadCrubm from "@/components/element/BreadCrubm";

import CourierView from "@/components/views/checkout/CourierView";
import PaymentView from "@/components/views/checkout/PaymentView";
import { transactionService } from "@/services/transaction/method";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  getCheckout,
  resetCheckout,
  setError,
} from "@/store/slices/chechkoutSlice";
import { ResponseError } from "@/utils/axios/response-error";

import { formatCurrency } from "@/utils/contant";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { Fragment, useEffect, useState } from "react";
import AddressView from "@/components/views/checkout/AddressView";

import dynamic from "next/dynamic";
import LoadingNavigate from "@/components/fragments/LoadingNavigate";

const ModalConfirmRepayment = dynamic(
  () => import("@/components/views/checkout/ModalRepayment"),
  {
    ssr: false,
  }
);

export interface TypeErrorCheckout {
  address: string;
  payment: string;
  ongkir: string;
}

const Checkout = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = params;
  const { replace, prefetch } = useRouter();
  const dispatch = useAppDispatch();
  const [diffrent, setDiffrent] = useState<string[] | null>(null);
  const { transaction, payment, address, costs, loading, errorSubmit } =
    useAppSelector((state) => state.check);
  const [isNavigate, setIsNavigate] = useState(false);

  useEffect(() => {
    prefetch(`/pembayaran/12345`);
    if (session.data?.user?.id) {
      dispatch(
        getCheckout({
          transactionId: id,
        })
      );
    }
  }, [session.data?.user?.id, dispatch, id, prefetch]);

  const handlePayment = async () => {
    if (!payment) {
      dispatch(setError({ payment: true }));
    }

    if (!address) {
      dispatch(setError({ address: true }));
    }

    if (!costs) {
      dispatch(setError({ ongkir: true }));
    }

    if (payment && address && costs) {
      setIsLoading(true);
      try {
        const paymentFunction =
          payment === "shopeepay" || payment === "gopay" || payment === "qris"
            ? transactionService.ewalletPayment
            : transactionService.payment;
        const res = await paymentFunction(costs, payment, id, address);

        if (res.status === 200) {
          prefetch(`/pembayaran/${res.data.transaction._id}`);
          if (res.data.diffrent) {
            setDiffrent(res.data.diffrent);
          } else {
            const transactionId = res.data.transaction._id;
            replace(`/pembayaran/${transactionId}`);
            dispatch(resetCheckout());
            setIsNavigate(true);
          }
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Fragment>
      {isNavigate ? (
        <LoadingNavigate isNavigate={isNavigate} />
      ) : (
        <main>
          <section className={styles.container}>
            <BreadCrubm />
            <h1>Checkout</h1>
            <div className={styles.content}>
              <div className={styles.left}>
                <AddressView isLoading={isLoading} transactionId={id} />

                <div className={styles.detailOrderMobile}>
                  <h3>Detail Pesanan</h3>
                  {loading ? (
                    <div className={styles.skeleton_wrapper}>
                      <div className={`${styles.skeleton_image}`}></div>
                      <div style={{ height: "100%" }}>
                        <div
                          className={`${styles.skeleton}`}
                          style={{ width: "150px", height: "0.875rem" }}
                        ></div>
                        <div
                          className={`${styles.skeleton}`}
                          style={{
                            width: "100px",
                            height: "0.875rem",
                            marginTop: "0.5rem",
                          }}
                        ></div>
                        <div
                          className={`${styles.skeleton}`}
                          style={{
                            width: "100px",
                            height: "0.875rem",
                            marginTop: "30px",
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    transaction?.items.map((item) => (
                      <div
                        className={styles.detailOrderMobile__list}
                        key={item?.productId?._id}
                      >
                        <div className={styles.detailOrderMobile__list__image}>
                          <Image
                            src={item?.productId?.image[0]}
                            alt={item?.productId?.name}
                            width={100}
                            height={100}
                          />
                        </div>
                        <div
                          className={styles.detailOrderMobile__list__content}
                        >
                          <div>
                            <h3>{item?.productId?.name}</h3>
                            <p>{item?.atributeValue}</p>
                          </div>
                          <span>
                            {formatCurrency(Number(item?.productId?.price))} x{" "}
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <CourierView isLoading={isLoading} />
                <PaymentView isLoading={isLoading} />
              </div>
              <div className={styles.right}>
                <div className={styles.detailOrder}>
                  <h3>Detail Pesanan</h3>

                  {loading ? (
                    <div className={styles.skeleton_wrapper}>
                      <div className={`${styles.skeleton_image}`}></div>
                      <div style={{ height: "100%" }}>
                        <div
                          className={`${styles.skeleton}`}
                          style={{ width: "150px", height: "0.875rem" }}
                        ></div>
                        <div
                          className={`${styles.skeleton}`}
                          style={{
                            width: "100px",
                            height: "0.875rem",
                            marginTop: "0.5rem",
                          }}
                        ></div>
                        <div
                          className={`${styles.skeleton}`}
                          style={{
                            width: "100px",
                            height: "0.875rem",
                            marginTop: "30px",
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    transaction?.items.map((item) => (
                      <div
                        className={styles.detailOrder__list}
                        key={item?.productId?._id}
                      >
                        <div className={styles.detailOrder__list__image}>
                          <Image
                            src={item?.productId?.image[0]}
                            alt={item?.productId?.name}
                            width={100}
                            height={100}
                          />
                        </div>

                        <div className={styles.detailOrder__list__content}>
                          <div>
                            <h3>{item?.productId?.name}</h3>
                            <p>{item.atributeValue}</p>
                          </div>
                          <span>
                            {formatCurrency(Number(item?.productId?.price))} x{" "}
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.summeryWrapper}>
                  <h3>Rincian Pesanan</h3>
                  <div className={styles.summeryWrapper__wrapper}>
                    <div className={`${styles.summeryWrapper__summery}`}>
                      {loading ? (
                        <>
                          <div
                            className={`${styles.skeleton}`}
                            style={{ maxWidth: "100px", height: "1rem" }}
                          ></div>
                          <div
                            className={`${styles.skeleton}`}
                            style={{ width: "100px", height: "1rem" }}
                          ></div>
                        </>
                      ) : (
                        <>
                          <p>Subtotal</p>
                          <span>
                            {formatCurrency(
                              (transaction?.subtotal as number) || 0
                            )}
                          </span>
                        </>
                      )}
                    </div>
                    <div className={`${styles.summeryWrapper__summery}`}>
                      {loading ? (
                        <>
                          <div
                            className={`${styles.skeleton}`}
                            style={{ maxWidth: "100px", height: "1rem" }}
                          ></div>
                          <div
                            className={`${styles.skeleton}`}
                            style={{ width: "100px", height: "1rem" }}
                          ></div>
                        </>
                      ) : (
                        <>
                          <p>Diskon</p>
                          <span>
                            {transaction?.diskon ? "-" : ""}{" "}
                            {formatCurrency(
                              (transaction?.diskon as number) || 0
                            )}
                          </span>
                        </>
                      )}
                    </div>
                    <div className={`${styles.summeryWrapper__summery}`}>
                      {loading ? (
                        <>
                          <div
                            className={`${styles.skeleton}`}
                            style={{ maxWidth: "100px", height: "1rem" }}
                          ></div>
                          <div
                            className={`${styles.skeleton}`}
                            style={{ width: "100px", height: "1rem" }}
                          ></div>
                        </>
                      ) : (
                        <>
                          <p>Biaya Layanan</p>
                          <span>{formatCurrency(1000)}</span>
                        </>
                      )}
                    </div>
                    <div className={`${styles.summeryWrapper__summery}`}>
                      {loading ? (
                        <>
                          <div
                            className={`${styles.skeleton}`}
                            style={{ maxWidth: "100px", height: "1rem" }}
                          ></div>
                          <div
                            className={`${styles.skeleton}`}
                            style={{ width: "100px", height: "1rem" }}
                          ></div>
                        </>
                      ) : (
                        <>
                          <p>Biaya Pengiriman</p>
                          <span>
                            {formatCurrency(
                              (transaction?.shippingCost as number) || 0
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`${styles.summeryWrapper__summery}`}>
                    {loading ? (
                      <>
                        <div
                          className={`${styles.skeleton}`}
                          style={{ maxWidth: "100px", height: "1rem" }}
                        ></div>
                        <div
                          className={`${styles.skeleton}`}
                          style={{ width: "100px", height: "1rem" }}
                        ></div>
                      </>
                    ) : (
                      <>
                        <span>Total</span>
                        <span>
                          {formatCurrency(
                            ((transaction?.totalPayment as number) || 0) +
                              ((transaction?.shippingCost as number) || 0)
                          )}
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="checkout"
                    className={styles.checkout}
                    onClick={handlePayment}
                    disabled={
                      loading ||
                      errorSubmit.payment ||
                      errorSubmit.ongkir ||
                      errorSubmit.address ||
                      isLoading
                    }
                  >
                    {loading ? (
                      "Loading"
                    ) : (
                      <>
                        Lanjutkan Pembayaran
                        <ArrowRight width={16} height={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
          {diffrent && (
            <ModalConfirmRepayment
              id={id}
              diffrent={diffrent}
              onClose={() => setDiffrent(null)}
            />
          )}
        </main>
      )}
    </Fragment>
  );
};

export default Checkout;
