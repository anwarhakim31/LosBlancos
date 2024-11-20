import { orderService } from "@/services/order/method";
import { TypeTransaction } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./done.module.scss";
import Image from "next/image";
import { formatCurrency, formateDate } from "@/utils/contant";

import Loader from "@/components/element/Loader";
import ModalConfirmRebuy from "@/components/fragments/ModalConfirmRebuy";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { transactionService } from "@/services/transaction/method";
import Pagination from "@/components/element/Pagination";

const DoneView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TypeTransaction[]>([]);
  const [diffrent, setDiffrent] = useState<string[] | null>(null);
  const [id, setId] = useState<string>("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPage: 0,
  });

  const page = Number((searchParams.get("page") as string) || 1);
  const limit = Number((searchParams.get("limit") as string) || 8);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        const res = await orderService.get(
          session?.data?.user?.id as string,
          "selesai",
          "dibayar",
          limit,
          page
        );

        if (res.status === 200) {
          setData(res.data.transaction);
          setPagination(res.data.pagination);
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.data?.user?.id) {
      getData();
    }
  }, [session?.data?.user?.id, setLoading, page, limit]);

  const handleRebuy = async (id: string) => {
    try {
      const res = await transactionService.cekStock(id);

      if (res.status === 200) {
        if (res.data.diffrent.length > 0) {
          setId(id);
          setDiffrent(res.data.diffrent);
        } else {
          const res = await transactionService.rebuy(id);
          console.log(res);
          if (res.status === 200) {
            router.push(`/checkout/${res.data.transaction}`);
          }
        }
      }
    } catch (error) {
      ResponseError(error);
    }
  };

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
                {order.transactionStatus === "tertunda"
                  ? "Dalam Proses"
                  : "Selesai"}
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
              <div></div>
              <div className={styles.card__footer__btns}>
                <Link
                  className={`${styles.card__footer__btn} `}
                  href={`${`/pembayaran/${order._id}`}?status=sukses`}
                >
                  Detail
                </Link>

                <button
                  className={styles.card__footer__btn}
                  type="button"
                  aria-label="Diterima"
                  onClick={() => handleRebuy(order.invoice as string)}
                >
                  Beli lagi
                </button>
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
      {diffrent && (
        <ModalConfirmRebuy
          onClose={() => {
            setDiffrent(null);
            setId("");
          }}
          id={id}
          diffrent={diffrent}
        />
      )}
      {!loading && data.length > 0 && <Pagination pagination={pagination} />}
    </Fragment>
  );
};

export default DoneView;
