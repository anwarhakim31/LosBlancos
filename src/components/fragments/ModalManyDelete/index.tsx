/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { TriangleAlert } from "lucide-react";
import ButtonClick from "@/components/element/ButtonClick";
import { toast } from "sonner";
import { ResponseError } from "@/utils/axios/response-error";
import { useState } from "react";

const ModalManyDelete = ({
  onClose,
  title,
  setIsDeleteMany,
  setCheck,
  fetching,
  callback,
}: {
  onClose: () => void;
  title: string;
  setCheck: React.Dispatch<React.SetStateAction<string[]>>;
  fetching: () => Promise<any>;
  setIsDeleteMany: React.Dispatch<React.SetStateAction<boolean>>;
  callback: () => Promise<any>;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteMany = async () => {
    setLoading(true);
    try {
      const res = await fetching();

      if (res.status === 200) {
        toast.success(res.data.message);
        setIsDeleteMany(false);
        setCheck([]);
        callback();
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
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
            <ButtonClick
              title="Ya"
              onClick={handleDeleteMany}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalManyDelete;
