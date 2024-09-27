/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/components/element/Modal";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { TriangleAlert } from "lucide-react";
import ButtonClick from "@/components/element/ButtonClick";
import { userService } from "@/services/user/method";
import { ResponseError } from "@/utils/axios/response-error";
import { toast } from "sonner";

const ModalOneDelete = ({
  onClose,
  data,
  title,
}: {
  onClose: () => void;
  data: any | null;
  title: string;
}) => {
  const handleDelete = async () => {
    if (data) {
      try {
        const res = await userService.deleteUser(data._id);

        if (res.status === 200) {
          toast.success(res.data.message);
          onClose();
        }
      } catch (error) {
        ResponseError(error);
      }
    }
  };

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
