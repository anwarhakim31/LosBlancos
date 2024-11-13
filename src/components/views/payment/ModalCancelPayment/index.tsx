import PortalNotification from "@/components/element/PortalNotification";
import styles from "./modal.module.scss";

import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";
import { transactionService } from "@/services/transaction/method";
import { useState } from "react";
import { toast } from "sonner";
import ButtonClick from "@/components/element/ButtonClick";

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
        replace("/pesanan?status=dibatalkan");
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
          <AlertTriangle />

          <p>
            Apakah anda yakin ingin membatalkan transaksi? <br />
            Jika anda menyetujui ini, transaksi ini tidak dapat dikembalikan.
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

export default ModalCancelPayment;
