/* eslint-disable @typescript-eslint/no-explicit-any */

import styles from "./modal.module.scss";

import { TriangleAlert } from "lucide-react";
import ButtonClick from "@/components/element/ButtonClick";
import { useState } from "react";
import { ResponseError } from "@/utils/axios/response-error";

import PortalNotification from "@/components/element/PortalNotification";

import { orderService } from "@/services/order/method";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const ModalConfirmCancel = ({
  onClose,
  id,
  getData,
}: {
  onClose: () => void;
  id: string;
  getData: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const page = useSearchParams().get("page");
  const { replace } = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await orderService.batalkan(id);

      if (res.status === 200) {
        if (page) {
          replace(`/pesanan?page=1`);
        }
        getData();

        toast.success(res.data.message);
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
          <p>Apakah anda yakin ingin batalkan pesasnan ini?</p>
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

export default ModalConfirmCancel;
