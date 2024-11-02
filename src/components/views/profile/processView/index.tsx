import { orderService } from "@/services/order/method";
import { TypeTransaction } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./process.module.scss";
import Image from "next/image";
import { formatCurrency, formateDate } from "@/utils/contant";

import Loader from "@/components/element/Loader";
import ModalConfirmRebuy from "@/components/fragments/ModalConfirmRebuy";

const ProcessView = () => {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TypeTransaction[]>([]);
  const [diffrent, setDiffrent] = useState<string[] | null>(null);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        const res = await orderService.get(
          session?.data?.user?.id as string,
          "diproses",
          "dibayar"
        );

        if (res.status === 200) {
          setData(res.data.transaction);
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
  }, [session?.data?.user?.id, setLoading]);

  const handleChat = (order: TypeTransaction) => {
    let text = "";

    text = `Halo admin, saya sudah membayar transaksi nomor invoice ${order.invoice}. Tolong segera proses pesanan saya.`;

    window.open(
      `https://wa.me/6281310635243?text=${decodeURIComponent(text)}`,
      "_blank"
    );
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
                  ? "dalam proses"
                  : "dikemas"}
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
                {order.paymentCode && (
                  <button
                    className={styles.card__footer__btn}
                    type="button"
                    aria-label="Beli Lagi"
                    onClick={() => handleChat(order)}
                  >
                    Hubungi Admin
                  </button>
                )}
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
    </Fragment>
  );
};

export default ProcessView;
