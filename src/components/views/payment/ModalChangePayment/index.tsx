import PortalNotification from "@/components/element/PortalNotification";
import styles from "./modal.module.scss";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";
import { transactionService } from "@/services/transaction/method";
import { useState } from "react";
import ButtonClick from "@/components/element/ButtonClick";

const ModalChangePayment = ({
  onClose,
  invoice,
}: {
  onClose: () => void;
  invoice: string;
}) => {
  const [loading, setLoading] = useState(false);

  const { replace } = useRouter();

  const handleChangePayment = async () => {
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
    <PortalNotification onClose={loading ? () => {} : onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <AlertCircle />

          <p>
            Apakah anda yakin ingin mengganti metode pembayaran? Jika anda
            menyetujui ini, maka akan diarahkan kembali ke checkout.
          </p>
        </div>
        <div className={styles.footer}>
          <div style={{ width: "100px" }}>
            <ButtonClick title="Tidak" onClick={onClose} loading={loading} />
          </div>
          <div style={{ width: "100px" }}>
            <ButtonClick
              title="Ya"
              loading={loading}
              onClick={handleChangePayment}
            />
          </div>
        </div>
      </div>
    </PortalNotification>
  );
};

export default ModalChangePayment;
