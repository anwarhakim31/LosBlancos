/* eslint-disable @typescript-eslint/no-explicit-any */

import styles from "./modal.module.scss";

import { TriangleAlert } from "lucide-react";
import ButtonClick from "@/components/element/ButtonClick";
import { useEffect, useState } from "react";
import { ResponseError } from "@/utils/axios/response-error";

import PortalNotification from "@/components/element/PortalNotification";

import { useRouter } from "next/navigation";
import { transactionService } from "@/services/transaction/method";
import { useAppSelector } from "@/store/hook";

const ModalConfirmRepayment = ({
  onClose,
  diffrent,
  id,
}: {
  onClose: () => void;
  diffrent: string[];
  id: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { payment, address, costs } = useAppSelector((state) => state.check);

  const handlePay = async () => {
    if (costs && payment && address) {
      setLoading(true);
      try {
        const res = await transactionService.repayment(
          costs,
          payment,
          id,
          address
        );

        if (res.status === 200) {
          router.push(`/pembayaran/${id}`);
          onClose();
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      diffrent.filter((item) => item.includes("habis")).length ===
      diffrent.length
    ) {
      const timeout = setTimeout(() => {
        onClose();
        router.replace(`/pesanan`);
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [diffrent, onClose, router]);

  useEffect(() => {
    if (
      diffrent.filter((item) => item.includes("habis")).length ===
      diffrent.length
    ) {
      const countdowns = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          clearInterval(countdowns);
        }
      }, 1000);

      return () => {
        clearInterval(countdowns);
      };
    }
  }, [diffrent, countdown, setCountdown]);

  return (
    <PortalNotification onClose={() => {}}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__content}>
          <TriangleAlert />
          <p>Terdapat perbedaan stok pada pesanan :</p>
          <ol>
            {diffrent.map((item, index) => {
              return <li key={index + 1}>{item}</li>;
            })}
          </ol>
          <p>{`${
            diffrent.filter((item) => item.includes("habis")).length ===
            diffrent.length
              ? "Anda tidak bisa melanjutkan transaksi ini!"
              : "Apakah ingin melanjutkan untuk melakukan pembayaran ini? dan otomatis jumlah pembelian akan di sesuaikan dengan stok yang tersedia."
          }`}</p>

          {diffrent.filter((item) => item.includes("habis")).length ===
            diffrent.length && <span>{countdown}</span>}
        </div>

        {diffrent.filter((item) => item.includes("habis")).length !==
          diffrent.length && (
          <div className={styles.modal__footer}>
            <div style={{ width: "100px" }}>
              <ButtonClick title="Tidak" onClick={onClose} loading={loading} />
            </div>
            <div style={{ width: "100px" }}>
              <ButtonClick title="Ya" loading={loading} onClick={handlePay} />
            </div>
          </div>
        )}
      </div>
    </PortalNotification>
  );
};

export default ModalConfirmRepayment;
