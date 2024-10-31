/* eslint-disable @typescript-eslint/no-explicit-any */

import styles from "./modal.module.scss";

import { TriangleAlert } from "lucide-react";
import ButtonClick from "@/components/element/ButtonClick";
import { useState } from "react";
import { ResponseError } from "@/utils/axios/response-error";

import PortalNotification from "@/components/element/PortalNotification";
import { transactionService } from "@/services/transaction/method";
import { useRouter } from "next/navigation";

const ModalConfirmChangePayment = ({
  onClose,
  invoice,
}: {
  onClose: () => void;
  invoice: string;
}) => {
  const { replace } = useRouter();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await transactionService.changePayment(invoice);

      if (res.status === 200) {
        replace("/checkout/" + res.data.transaction);
        onClose();
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalNotification onClose={() => {}}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__content}>
          <TriangleAlert />
          <p>Apakah anda yakin ingin mengganti metode pembayaran?</p>
        </div>

        <div className={styles.modal__footer}>
          <div style={{ width: "100px" }}>
            <ButtonClick title="Tidak" onClick={onClose} loading={loading} />
          </div>
          <div style={{ width: "100px" }}>
            <ButtonClick title="Ya" loading={loading} onClick={handleDelete} />
          </div>
        </div>
      </div>
    </PortalNotification>
  );
};

export default ModalConfirmChangePayment;
