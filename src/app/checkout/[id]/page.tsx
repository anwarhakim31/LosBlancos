"use client";
import styles from "./checkout.module.scss";
import BreadCrubm from "@/components/element/BreadCrubm";
import Footer from "@/components/layouts/Footer";
import CourierView from "@/components/views/checkout/CourierView";
import ShippingView from "@/components/views/checkout/ShippingView";

import { transactionService } from "@/services/transaction/method";
import { ResponseError } from "@/utils/axios/response-error";

import React, { Fragment, useEffect, useState } from "react";

const Checkout = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [data, setData] = useState([]);

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const res = await transactionService.get(id);

        if (res.status === 200) {
          setData(res.data.transaction);
        }
      } catch (error) {
        ResponseError(error);
      }
    };

    if (id) {
      getTransaction();
    }
  }, [id]);

  console.log(data);

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <BreadCrubm />
          <h1>Checkout</h1>
          <div className={styles.content}>
            <div className={styles.left}>
              <ShippingView />
              <CourierView />
            </div>
            <div className={styles.right}></div>
          </div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default Checkout;
