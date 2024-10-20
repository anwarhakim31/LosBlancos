"use client";
import styles from "./checkout.module.scss";
import BreadCrubm from "@/components/element/BreadCrubm";
import Footer from "@/components/layouts/Footer";
import CourierView from "@/components/views/checkout/CourierView";
import ShippingView from "@/components/views/checkout/ShippingView";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getCheckout } from "@/store/slices/chechkoutSlice";

import { formatCurrency } from "@/utils/contant";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import React, { Fragment, useEffect } from "react";

const Checkout = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const { id } = params;
  const dispatch = useAppDispatch();
  const { transaction } = useAppSelector((state) => state.check);

  useEffect(() => {
    if (session.data?.user?.id) {
      dispatch(
        getCheckout({
          transactionId: id,
          userId: session.data?.user?.id as string,
        })
      );
    }
  }, [session.data?.user?.id, dispatch, id]);

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <BreadCrubm />
          <h1>Checkout</h1>
          <div className={styles.content}>
            <div className={styles.left}>
              <ShippingView />
              <div className={styles.detailOrderMobile}>
                <h3>Detail Pesanan</h3>

                {transaction?.items.map((item) => (
                  <div
                    className={styles.detailOrderMobile__list}
                    key={item.productId._id}
                  >
                    <div className={styles.detailOrderMobile__list__image}>
                      <Image
                        src={item.productId.image[0]}
                        alt={item.productId.name}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.detailOrderMobile__list__content}>
                      <div>
                        <h3>{item.productId.name}</h3>
                        <p>
                          {item.atribute} : {item.atributeValue}
                        </p>
                      </div>
                      <span>
                        {formatCurrency(Number(item.productId.price))} x{" "}
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <CourierView />
            </div>
            <div className={styles.right}>
              <div className={styles.detailOrder}>
                <h3>Detail Pesanan</h3>

                {transaction?.items.map((item) => (
                  <div
                    className={styles.detailOrder__list}
                    key={item.productId._id}
                  >
                    <div className={styles.detailOrder__list__image}>
                      <Image
                        src={item.productId.image[0]}
                        alt={item.productId.name}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className={styles.detailOrder__list__content}>
                      <div>
                        <h3>{item.productId.name}</h3>
                        <p>
                          {item.atribute} : {item.atributeValue}
                        </p>
                      </div>
                      <span>
                        {formatCurrency(Number(item.productId.price))} x{" "}
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.summeryWrapper}>
                <h3>Rincian Pesanan</h3>
                <div className={styles.summeryWrapper__wrapper}>
                  <div className={`${styles.summeryWrapper__summery}`}>
                    <p>Subtotal</p>
                    <span>
                      {formatCurrency((transaction?.subtotal as number) || 0)}
                    </span>
                  </div>
                  <div className={`${styles.summeryWrapper__summery}`}>
                    <p>Biaya Layanan</p>
                    <span>{formatCurrency(1000)}</span>
                  </div>
                  <div className={`${styles.summeryWrapper__summery}`}>
                    <p>Biaya Pengiriman</p>
                    <span>
                      {formatCurrency(
                        (transaction?.shippingCost as number) || 0
                      )}
                    </span>
                  </div>
                </div>
                <div className={`${styles.summeryWrapper__summery}`}>
                  <span>Total</span>
                  <span>
                    {formatCurrency(transaction?.totalPayment as number)}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="checkout"
                  className={styles.checkout}
                  // onClick={handleCheckout}
                >
                  Lanjutkan Pembayaran <ArrowRight width={16} height={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default Checkout;
