import Modal from "@/components/element/Modal";
// import styles from "./modal.module.scss";
// import HeaderModal from "@/components/element/HeaderModal";

// import { formatCurrency } from "@/utils/contant";
import { FC } from "react";
// import { useAppSelector } from "@/store/hook";

interface PropsType {
  onClose: () => void;
}

const ModalChangeOngkir: FC<PropsType> = ({ onClose }) => {
  // const { costs } = useAppSelector((state) => state.ongkir);

  return (
    <Modal onClose={onClose}>
      <div></div>
      {/* <div onClick={(e) => e.stopPropagation()} className={styles.container}>
        <HeaderModal onClose={onClose} title={"Ganti Jenis Pengiriman"} />

        <div className={styles.wrapper}>
          {costs.length > 0 &&
            costs.map((item, index) => (
              <div key={index} className={styles.list}>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.service.split("Pos")}</p>
                  <span>
                    Estimasi Tiba {item.estimated.split("hari")} -{" "}
                    {Number(item.estimated.split("hari")[0]) + 1} hari
                  </span>
                </div>
                <h3>{formatCurrency(Number(item.price))}</h3>
              </div>
            ))}
        </div>
      </div> */}
    </Modal>
  );
};

export default ModalChangeOngkir;
