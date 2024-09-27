/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { TriangleAlert } from "lucide-react";
import ButtonClick from "@/components/element/ButtonClick";

const ModalOneDelete = ({
  onClose,
  title,
  handleDelete,
}: {
  onClose: () => void;
  title: string;
  handleDelete: () => Promise<void>;
}) => {
  return (
    <Modal onClose={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <HeaderModal title="Konfirmasi Hapus" onClose={onClose} />
        <div className={styles.modal__content}>
          <TriangleAlert />

          <p>{title}</p>
        </div>
        <div className={styles.modal__footer}>
          <div style={{ width: "100px" }}>
            <ButtonClick title="Tidak" onClick={onClose} />
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
