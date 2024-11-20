import { orderService } from "@/services/order/method";
import { TypeTransaction } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { useSession } from "next-auth/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./pending.module.scss";
import Image from "next/image";
import { formatCountdown, formatCurrency, formateDate } from "@/utils/contant";
import Link from "next/link";
import Loader from "@/components/element/Loader";
import ModalConfirmChangePayment from "./ModalConfirmChangePayment";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/element/Pagination";
import ModalConfirmCancel from "./ModalConfirmCancel";

const PendingView = () => {
  const searchParams = useSearchParams();
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TypeTransaction[]>([]);
  const [arrExpired, setArrExpired] = useState<
    { _id: string; expired: number }[]
  >([]);
  const [isChange, setIsChange] = useState<string | null>(null);
  const [isCancel, setIsCancel] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPage: 0,
  });

  const page = Number((searchParams.get("page") as string) || 1);
  const limit = Number((searchParams.get("limit") as string) || 8);

  const getData = useCallback(async () => {
    try {
      const res = await orderService.get(
        session?.data?.user?.id as string,
        "tertunda",
        "tertunda",
        limit,
        page
      );

      if (res.status === 200) {
        setData(res.data.transaction);
        setPagination(res.data.pagination);
        const now = new Date();

        res.data.transaction.forEach((transaction: TypeTransaction) => {
          const expired = new Date(
            transaction.paymentExpired || transaction.expired
          );

          const diff = expired.getTime() - now.getTime();

          if (expired > now) {
            setArrExpired((prev) => {
              if (prev.find((item) => item._id === transaction._id)) {
                return prev;
              } else {
                return [
                  ...prev,
                  { _id: transaction._id as string, expired: diff },
                ];
              }
            });
          } else {
            setArrExpired((prev) =>
              prev.filter((item) => item._id !== transaction._id)
            );
            setData((prev) =>
              prev.filter((item) => item._id !== transaction._id)
            );
          }
        });

        const interval = setInterval(() => {
          const now = new Date();

          res.data.transaction.forEach((transaction: TypeTransaction) => {
            const expired = new Date(
              transaction.paymentExpired || transaction.expired
            );

            const diff = expired.getTime() - now.getTime();

            if (expired > now) {
              setArrExpired((prev) => {
                return prev.map((item) => {
                  if (item._id === transaction._id) {
                    return { ...item, expired: diff };
                  } else {
                    return item;
                  }
                });
              });
            } else {
              setArrExpired((prev) =>
                prev.filter((item) => item._id !== transaction._id)
              );
              setData((prev) =>
                prev.filter((item) => item._id !== transaction._id)
              );
            }
          });
        }, 1000);

        return () => clearInterval(interval);
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  }, [
    session?.data?.user?.id,
    setData,
    setArrExpired,
    setLoading,
    page,
    limit,
  ]);

  useEffect(() => {
    if (session?.data?.user?.id) {
      getData();
    }
  }, [session?.data?.user?.id, getData]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : data.length > 0 ? (
        data.map((order) => (
          <div className={styles.card} key={order._id}>
            <div className={styles.card__header}>
              <div className={styles.card__header__info}>
                <h3>{order?.invoice}</h3>
                <h3>{formateDate(order.transactionDate)}</h3>
              </div>
              <p className={styles.card__header__status}>
                {order.paymentCode &&
                order.paymentName &&
                order.paymentCreated &&
                order.paymentExpired
                  ? "Belum bayar"
                  : "Menunggu membuat pembayaran"}
              </p>
            </div>
            {order?.items?.map((product) => (
              <div className={styles.card__body} key={product._id}>
                <div className={styles.card__body__image}>
                  <Image
                    src={product?.productId?.image[0] || "/default.png"}
                    alt={product?.productId?.name}
                    width={100}
                    height={100}
                    priority
                  />
                </div>
                <div className={styles.card__body__info}>
                  <div>
                    <h3>{product?.productId?.name}</h3>
                    <span>{product.atributeValue}</span>
                  </div>
                  <h5>
                    {product?.quantity} x{" "}
                    {formatCurrency(Number(product?.productId?.price) || 0)}
                  </h5>
                </div>
              </div>
            ))}
            <div className={styles.card__total}>
              <h3>Total</h3>
              <h5>
                {formatCurrency(
                  Number(order.subtotal + order.shippingCost + 1000) || 0
                )}
              </h5>
            </div>
            <div className={styles.card__footer}>
              <div
                className={`${styles.card__footer__countdown} ${
                  order.paymentCode ? styles.code : styles.nocode
                }`}
              >
                <p>
                  {order.paymentCode ? "Bayar dalam" : "Lanjutkan dalam"}
                  {"  "}
                  <span>
                    {" "}
                    {formatCountdown(
                      arrExpired.find((item) => item._id === order._id)
                        ?.expired as number
                    )}
                  </span>{" "}
                  {order.paymentCode &&
                    "dengan" + "  " + order.paymentName?.toLocaleUpperCase()}
                </p>
              </div>
              <div className={styles.card__footer__btns}>
                {
                  <button
                    className={styles.card__footer__btn}
                    type="button"
                    aria-label="ganti pembayaran"
                    onClick={() =>
                      order.paymentCode
                        ? setIsChange(order.invoice as string)
                        : setIsCancel(order._id as string)
                    }
                  >
                    {order.paymentCode ? "Ganti Pembayaran" : "Batalkan"}
                  </button>
                }
                <Link
                  className={`${styles.card__footer__btn} `}
                  href={`${
                    !order.paymentCode
                      ? `/checkout/${order._id}`
                      : `/pembayaran/${order._id}`
                  }`}
                >
                  {`${order.paymentCode ? "Bayar" : "Lanjutkan"}`}
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.empty}>
          <Image src="/no-order.png" alt="empty" width={150} height={100} />
          <p>Tidak ada pesanan</p>
        </div>
      )}
      {isChange && (
        <ModalConfirmChangePayment
          invoice={isChange as string}
          onClose={() => setIsChange(null)}
        />
      )}
      {isCancel && (
        <ModalConfirmCancel
          id={isCancel as string}
          onClose={() => setIsCancel(null)}
          getData={getData}
        />
      )}
      {!loading && data.length > 0 && <Pagination pagination={pagination} />}
    </Fragment>
  );
};

export default PendingView;
