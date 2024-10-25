import PortalNotification from "@/components/element/PortalNotification";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";
import { transactionService } from "@/services/transaction/method";
import { useState } from "react";

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
        <HeaderModal
          onClose={loading ? () => {} : onClose}
          title="Ganti Metode Pembayaran"
        />
        <div className={styles.content}>
          <AlertCircle />

          <p>
            Apakah anda yakin ingin mengganti metode pembayaran? <br />
            Jika anda menyetujui ini, maka akan diarahkan kembali ke checkout.
          </p>
        </div>
        <div className={styles.footer}>
          <button
            onClick={onClose}
            type="button"
            aria-label="tutup"
            className={styles.btn}
            disabled={loading}
          >
            Tidak
          </button>
          <button
            onClick={handleChangePayment}
            type="button"
            aria-label="tutup"
            className={styles.btn}
            disabled={loading}
          >
            Ya
          </button>
        </div>
      </div>
    </PortalNotification>
  );
};

export default ModalChangePayment;
