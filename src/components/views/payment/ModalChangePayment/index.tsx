import PortalNotification from "@/components/element/PortalNotification";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { AlertCircle } from "lucide-react";

const ModalChangePayment = ({
  onClose,
  invoice,
}: {
  onClose: () => void;
  invoice: string;
}) => {
  console.log(invoice);

  return (
    <PortalNotification onClose={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <HeaderModal onClose={onClose} title="Ganti Metode Pembayaran" />
        <div className={styles.content}>
          <AlertCircle />

          <p>
            Apakah anda yakin ingin mengganti metode pembayaran? <br />
            Jika anda menyetujui maka akan diarahkan kembali ke halaman checkout
            .
          </p>
        </div>
        <div className={styles.footer}>
          <button
            onClick={onClose}
            type="button"
            aria-label="tutup"
            className={styles.btn}
          >
            Batal
          </button>
        </div>
      </div>
    </PortalNotification>
  );
};

export default ModalChangePayment;
