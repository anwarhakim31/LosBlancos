import Modal from "@/components/element/Modal";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { Dispatch, FC, SetStateAction } from "react";
import { TypeShippingAddress } from "@/services/type.module";
import { toast } from "sonner";

interface PropsType {
  onClose: () => void;
  address: TypeShippingAddress[];
  setSelected: Dispatch<SetStateAction<TypeShippingAddress | null>>;
}

const ModalChangeAddress: FC<PropsType> = ({
  onClose,
  address,
  setSelected,
}) => {
  const handleChange = (value: TypeShippingAddress) => {
    if (value) {
      setSelected(value);
      toast.success("Berhasil mengganti alamat pengiriman");
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={styles.container}>
        <HeaderModal onClose={onClose} title={"Ganti Alamat Pengiriman"} />

        <div className={styles.wrapper}>
          {address.length > 0 &&
            address.map((item, index) => (
              <div
                key={index}
                className={styles.list}
                onClick={() => handleChange(item)}
              >
                <div className={styles.list__contact}>
                  <h4>{item?.fullname}</h4> <small>|</small>
                  <p className={styles.list__contact__phone}>{item?.phone}</p>
                </div>
                <p className={styles.list__detail}>{item?.address}</p>
                <div className={styles.list__address}>
                  <p>{item.subdistrict},</p>
                  <p>{item.city.name},</p>
                  <p>{item.province.name},</p>
                  <p>ID</p>
                  <p>{item.postalCode}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default ModalChangeAddress;
