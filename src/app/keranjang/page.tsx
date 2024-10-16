"use client";

import Footer from "@/components/layouts/Footer";
import React, { Fragment } from "react";

import BreadCrubm from "@/components/element/BreadCrubm";
import styles from "./cart.module.scss";
import Image from "next/image";
import { ArrowRight, Trash2 } from "lucide-react";
import QuantityAction from "@/components/element/Quantity";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { formatCurrency } from "@/utils/contant";

import {
  deleteCart,
  minusQuantity,
  plusQuantity,
} from "@/store/slices/cartSlice";
import { itemCartType } from "@/services/type.module";
import { useSession } from "next-auth/react";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const session = useSession();
  const { cart } = useAppSelector((state) => state.cart);

  const handleMaxQuantity = (item: itemCartType) => {
    if (
      typeof item.product.stock === "number" &&
      item.quantity < item.product.stock
    ) {
      dispatch(plusQuantity(item._id as string));
    }
  };

  const handleMinQuantity = (item: itemCartType) => {
    if (item.quantity > 1) {
      dispatch(minusQuantity(item._id as string));
    }
  };

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <BreadCrubm />
          <h1>Keranjang</h1>
          <div className={styles.content}>
            <div className={styles.listWrapper}>
              {cart?.items?.length > 0 &&
                cart.items.map((item) => (
                  <div className={styles.list} key={item._id}>
                    <div className={styles.list__image}>
                      <Image
                        src={item.product.image[0] || "/default.png"}
                        alt="image"
                        width={120}
                        height={120}
                      />
                    </div>

                    <div className={styles.list__info}>
                      <div className={styles.list__info__top}>
                        <small>{item.product.collectionName.name}</small>
                        <h3>{item.product.name}</h3>
                        <p>
                          <span>{item.atribute}</span>: {item.atributeValue}
                        </p>
                      </div>

                      <h4 className={styles.list__info__price}>
                        {formatCurrency(item.price)}
                      </h4>
                    </div>

                    <div className={styles.list__action}>
                      <button
                        onClick={() => {
                          dispatch(
                            deleteCart({
                              userId: session?.data?.user?.id as string,
                              productId: item.product._id as string,
                            })
                          );
                        }}
                        type="button"
                        className={styles.list__action__delete}
                      >
                        <Trash2 width={24} height={24} />
                      </button>
                      <QuantityAction
                        quantity={item.quantity}
                        handleMaxQuantity={() => handleMaxQuantity(item)}
                        handleMinQuantity={() => handleMinQuantity(item)}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className={styles.summeryWrapper}>
              <h3>Rincian Pesanan</h3>
              <div className={styles.summeryWrapper__wrapper}>
                <div className={`${styles.summeryWrapper__summery}`}>
                  <p>Subtotal</p>
                  <span>{formatCurrency(cart?.total)}</span>
                </div>
                <div className={`${styles.summeryWrapper__summery}`}>
                  <p>Diskon</p>
                  <span>{0}</span>
                </div>
              </div>
              <div className={`${styles.summeryWrapper__summery}`}>
                <span>Total</span>
                <span>{formatCurrency(cart?.total)}</span>
              </div>

              <div className={styles.summeryWrapper__discount}>
                <input
                  type="text"
                  id="discount"
                  name="discount"
                  placeholder="Masukkan Kode Diskon"
                />
                <button type="button" aria-label="checkout">
                  Terapkan
                </button>
              </div>

              <button
                type="button"
                aria-label="checkout"
                className={styles.checkout}
              >
                Checkout <ArrowRight width={16} height={16} />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default CartPage;
