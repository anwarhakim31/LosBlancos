import Modal from "@/components/element/Modal";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { TypeShippingAddress } from "@/services/type.module";
import { toast } from "sonner";

import { Trash2 } from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { setShippingAddress } from "@/store/slices/chechkoutSlice";
import { getOngkir } from "@/store/slices/ongkirSlice";
import ModalDeleteAddress from "@/components/fragments/ModalDeleteAddress";

interface PropsType {
  onClose: () => void;
  address: TypeShippingAddress[];
  setAddress: Dispatch<SetStateAction<TypeShippingAddress[]>>;
  selected: TypeShippingAddress | null;
  transactionId: string;
}

const ModalChangeAddress: FC<PropsType> = ({
  onClose,
  address,
  setAddress,
  selected,
  transactionId,
}) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<TypeShippingAddress | null>(null);
  const handleChange = (value: TypeShippingAddress) => {
    if (value) {
      toast.success("Berhasil mengganti alamat pengiriman");
      dispatch(
        getOngkir({
          desProvince: value.province.name,
          desCity: value.city.name,
          transactionId: transactionId,
        })
      );
      dispatch(setShippingAddress(value));
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
                style={{
                  border:
                    selected?._id === item._id
                      ? "1px solid blue"
                      : "1px solid #d1d5db",
                }}
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
                <button
                  type="button"
                  aria-label="hapus alamat"
                  title="hapus alamat pengiriman"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(item);
                  }}
                >
                  <Trash2 />
                </button>
              </div>
            ))}
        </div>
      </div>
      {isOpen && (
        <ModalDeleteAddress
          onClose={() => setIsOpen(null)}
          data={isOpen}
          setAddress={setAddress}
          setShipping={true}
        />
      )}
    </Modal>
  );
};

export default ModalChangeAddress;
