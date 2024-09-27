import Modal from "@/components/element/Modal";
import styles from "./modal.module.scss";

const ModalDelete = ({
  onClose,
  data,
}: {
  onClose: () => void;
  data: [] | object;
}) => {
  console.log(data);
  return (
    <Modal onClose={onClose}>
      <div className={styles.modal}></div>
    </Modal>
  );
};

export default ModalDelete;
