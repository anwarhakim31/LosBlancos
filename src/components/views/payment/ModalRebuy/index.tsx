import PortalNotification from "@/components/element/PortalNotification";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";
import { transactionService } from "@/services/transaction/method";
import { useState } from "react";

const ModalRebuy = ({
  onClose,
  invoice,
  diffrent,
}: {
  onClose: () => void;
  invoice: string;
  diffrent: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const { replace } = useRouter();

  const handleRebuy = async () => {
    setLoading(true);
    try {
      const res = await transactionService.rebuy(invoice);
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
            {diffrent
              ? "Terdapat perbedaan stock pada pembelian ini, stok akan disesuaikan secara otomatis. Apakah anda yakin ingin melanjutkan?"
              : "Produk yang di beli akan sama dengan transaksi ini, apakah anda yakin ingin melanjutkan?"}
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
            onClick={handleRebuy}
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

export default ModalRebuy;
