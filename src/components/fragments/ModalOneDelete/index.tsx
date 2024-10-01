/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { TriangleAlert } from "lucide-react";
import ButtonClick from "@/components/element/ButtonClick";
import { useState } from "react";
import { ResponseError } from "@/utils/axios/response-error";
import { toast } from "sonner";

const ModalOneDelete = ({
  onClose,
  title,
  fetching,
  callback,
}: {
  onClose: () => void;
  title: string;
  fetching: () => Promise<any>;
  callback: () => Promise<any>;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetching();

      if (res.status === 200) {
        toast.success(res.data.message);
        onClose();
        callback();
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={loading ? () => {} : onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <HeaderModal
          title="Konfirmasi Hapus"
          onClose={loading ? () => {} : onClose}
        />
        <div className={styles.modal__content}>
          <TriangleAlert />

          <p>{title}</p>
        </div>
        <div className={styles.modal__footer}>
          <div style={{ width: "100px" }}>
            <ButtonClick title="Tidak" onClick={onClose} loading={loading} />
          </div>
          <div style={{ width: "100px" }}>
            <ButtonClick title="Ya" onClick={handleDelete} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalOneDelete;
