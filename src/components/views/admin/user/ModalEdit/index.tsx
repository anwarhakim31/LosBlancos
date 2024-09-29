import Modal from "@/components/element/Modal";
import style from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import ButtonSubmit from "@/components/element/ButtonSubmit";

interface PropsType {
  onclose: () => void;
}

const ModalEdit = ({ onclose }: PropsType) => {
  return (
    <Modal onClose={onclose}>
      <div role="dialog" className={style.modal}>
        <HeaderModal title="Edit Data User" onClose={onclose} />
        <form>
          <div className={style.modal__content}>
            <label htmlFor="">Nama Lengkap</label>
          </div>
          <div className={style.modal__footer}>
            <div style={{ width: "100px" }}>
              <ButtonSubmit title="Simpan" />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalEdit;
