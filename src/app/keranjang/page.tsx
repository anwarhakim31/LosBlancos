"use client";

import React, { Fragment, useRef, useState } from "react";

import BreadCrubm from "@/components/element/BreadCrubm";
import styles from "./cart.module.scss";
import Image from "next/image";
import { ArrowRight, TicketPlus, Trash2, X } from "lucide-react";
import QuantityAction from "@/components/element/Quantity";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { formatCurrency } from "@/utils/contant";

import {
  clearCart,
  deleteCart,
  minusQuantity,
  plusQuantity,
} from "@/store/slices/cartSlice";
import { itemCartType } from "@/services/type.module";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ResponseError } from "@/utils/axios/response-error";
import { transactionService } from "@/services/transaction/method";
import { useRouter } from "next/navigation";
import { diskonService } from "@/services/discount/method";

import { AxiosError } from "axios";

const CartPage = () => {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const summeryRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const session = useSession();
  const [code, setCode] = useState<string>("");
  const [discount, setDiscount] = useState<{
    _id: string;
    percent: number;
    code: string;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const { cart, loading } = useAppSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);

  const handleMaxQuantity = (item: itemCartType) => {
    const total = item.product.stock.find(
      (stock) =>
        stock.attribute === item.atribute && stock.value === item.atributeValue
    )?.stock;

    if (total && item.quantity < total) {
      dispatch(plusQuantity(item._id as string));
    }
  };

  const handleMinQuantity = (item: itemCartType) => {
    if (item.quantity > 1) {
      dispatch(minusQuantity(item._id as string));
    }
  };

  const handleCheckout = async () => {
    if (session.status !== "authenticated") {
      router.push("/login");
      return;
    }

    if (cart?.items?.length === 0) {
      return;
    }
    setIsLoading(true);
    if (cart?.items?.length > 0) {
      const cartId = "yes";

      try {
        const res = await transactionService.create(
          session.data?.user?.id as string,
          cart?.items as itemCartType[],
          cart?.total as number,
          cartId,
          discount?._id
        );

        if (res.status == 200) {
          router.prefetch(`/checkout/${res.data.id}`);

          router.push("/checkout/" + res.data.id);

          dispatch(clearCart());
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleApplyDiscount = async () => {
    if (code) {
      try {
        const res = await diskonService.apply(code);

        if (res.status === 200) {
          setDiscount(res.data.discount);
          setError("");
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
          setError(error?.response?.data.message);
        }
      }
    }
  };

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <BreadCrubm />
          <h1>Keranjang</h1>
          <div className={styles.content}>
            {loading && (
              <div
                className={styles.card_loader}
                style={{
                  opacity: loading ? 1 : 0,
                  visibility: loading ? "visible" : "hidden",
                }}
              >
                <div className={styles.loading}></div>
                <small style={{ marginTop: "0.5rem" }}>Loading</small>
              </div>
            )}
            {!loading && cart?.items?.length === 0 && (
              <div className={styles.empty}>
                <Image
                  src="/empty-cart.png"
                  alt="image"
                  width={200}
                  height={200}
                  priority
                />
                <p>Keranjangan anda masih kosong.</p>
                <span>silahkan pilih produk terlebih dahulu</span>
                <Link
                  href={"/produk"}
                  className={styles.button}
                  aria-label="shop now"
                >
                  Lanjut Belanja
                </Link>
              </div>
            )}
            {!loading && cart?.items?.length > 0 && (
              <>
                <div
                  className={styles.listWrapper}
                  ref={listRef}
                  style={{
                    opacity: loading || cart?.items?.length === 0 ? 0 : 1,
                    transform: loading ? "translateY(50px)" : "translateY(0px)",
                    visibility:
                      loading || cart?.items?.length === 0
                        ? "hidden"
                        : "visible",
                  }}
                >
                  {cart?.items?.length > 0 &&
                    cart.items.map((item) => (
                      <div className={styles.list} key={item._id}>
                        <Link
                          href={`/produk/${item.product.collectionName.name.replace(
                            /\s/g,
                            "-"
                          )}/${item.product._id}`}
                          className={styles.list__image}
                        >
                          <Image
                            src={item.product.image[0] || "/default.png"}
                            alt="image"
                            width={500}
                            height={500}
                            priority
                          />
                        </Link>

                        <div className={styles.list__info}>
                          <div className={styles.list__info__top}>
                            <small>{item.product.collectionName.name}</small>
                            <h3>{item.product.name}</h3>
                            <p>{item.atributeValue}</p>
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
                                  itemId: item._id as string,
                                })
                              );

                              if (
                                listRef.current &&
                                summeryRef.current &&
                                cart.items.length === 1
                              ) {
                                listRef.current.style.transition = "none";

                                summeryRef.current.style.transition = "none";
                              }
                            }}
                            type="button"
                            className={styles.list__action__delete}
                            title="Hapus produk dari keranjang"
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
                <div
                  className={styles.summeryWrapper}
                  ref={summeryRef}
                  style={{
                    opacity: loading || cart?.items?.length === 0 ? 0 : 1,
                    transform: loading ? "translateY(50px)" : "translateY(0px)",
                    visibility:
                      loading || cart?.items?.length === 0
                        ? "hidden"
                        : "visible",
                  }}
                >
                  <h3>Rincian Pesanan</h3>
                  <div className={styles.summeryWrapper__wrapper}>
                    <div className={`${styles.summeryWrapper__summery}`}>
                      <p>Subtotal</p>
                      <span>{formatCurrency(cart?.total)}</span>
                    </div>
                    <div className={`${styles.summeryWrapper__summery}`}>
                      <p>Diskon</p>
                      <span>
                        {discount && code ? "- " : ""}{" "}
                        {(discount &&
                          formatCurrency(
                            (cart?.total * discount?.percent) / 100
                          )) ||
                          0}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.summeryWrapper__summery}`}>
                    <span>Total</span>
                    <span>
                      {discount
                        ? formatCurrency(
                            cart.total - (discount?.percent * cart?.total) / 100
                          )
                        : formatCurrency(cart?.total)}
                    </span>
                  </div>

                  <div className={styles.summeryWrapper__discount}>
                    <input
                      type="text"
                      value={code}
                      id="discount"
                      name="discount"
                      placeholder="Masukkan kode diskon"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCode(e.target.value)
                      }
                      autoComplete="off"
                      disabled={
                        isLoading ||
                        loading ||
                        cart?.items?.length === 0 ||
                        discount !== null
                      }
                    />
                    {discount && (
                      <div className={styles.percentage}>
                        <p>{discount?.percent} %</p>{" "}
                        <div
                          onClick={() => {
                            setCode("");
                            setDiscount(null);
                          }}
                          className={styles.reset}
                        >
                          <X />
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label="checkout"
                      title="discount"
                      onClick={handleApplyDiscount}
                      disabled={
                        isLoading || cart?.items?.length === 0 || loading
                      }
                    >
                      <TicketPlus />
                    </button>
                  </div>
                  <small>{error && error}</small>

                  <button
                    type="button"
                    aria-label="checkout"
                    className={styles.checkout}
                    onClick={handleCheckout}
                    disabled={isLoading || cart?.items?.length === 0 || loading}
                  >
                    Checkout <ArrowRight width={16} height={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default CartPage;
