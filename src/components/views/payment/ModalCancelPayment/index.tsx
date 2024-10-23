import PortalNotification from "@/components/element/PortalNotification";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";
import { transactionService } from "@/services/transaction/method";
import { useState } from "react";
import { toast } from "sonner";

const ModalCancelPayment = ({
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
      const res = await transactionService.cancelPayment(invoice);

      if (res.status === 200) {
        toast.success("Transaksi berhasil dibatalkan, mohon tunggu");
        onClose();
        replace("/");
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
          title="Batalkan Transaksi"
        />
        <div className={styles.content}>
          <AlertCircle />

          <p>
            Apakah anda yakin ingin membatalkan transaksi? <br />
            Jika anda menyetujui ini, transaksi ini tidak dapat dikembalikan.
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

export default ModalCancelPayment;
