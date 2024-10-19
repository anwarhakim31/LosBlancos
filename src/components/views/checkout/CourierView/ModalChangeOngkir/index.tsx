import HeaderModal from "@/components/element/HeaderModal";
import Modal from "@/components/element/Modal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import styles from "./modal.module.scss";

import { formatCurrency } from "@/utils/contant";
import { FC } from "react";
import { setOngkir } from "@/store/slices/chechkoutSlice";

interface PropsType {
  onClose: () => void;
}

const ModalChangeOngkir: FC<PropsType> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { costs } = useAppSelector((state) => state.ongkir);
  const { costs: ongkir } = useAppSelector((state) => state.check);

  return (
    <Modal onClose={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={styles.container}>
        <HeaderModal onClose={onClose} title={"Ganti Jenis Pengiriman"} />

        <div className={styles.wrapper}>
          {costs.length > 0 &&
            costs.map((item, index) => (
              <div
                key={index}
                className={styles.list}
                tabIndex={0}
                onClick={() =>
                  item.service !== ongkir?.service &&
                  dispatch(setOngkir(item)) &&
                  onClose()
                }
                style={{
                  background:
                    item.service === ongkir?.service
                      ? "rgb(244, 244, 250)"
                      : "white",
                }}
              >
                <div>
                  <h4>{item.courier}</h4>
                  <p>{item.service.split("Pos")}</p>
                  <span>
                    Estimasi tiba{" "}
                    {item?.cost[0].etd.startsWith("0")
                      ? "ini"
                      : item.cost[0].etd.split("HARI")}{" "}
                    hari
                  </span>
                </div>
                <h3>{formatCurrency(item.cost[0].value as number)}</h3>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default ModalChangeOngkir;
