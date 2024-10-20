import Modal from "@/components/element/Modal";
import styles from "./modal.module.scss";
import HeaderModal from "@/components/element/HeaderModal";
import { Dispatch, FC, SetStateAction } from "react";
import { TypeShippingAddress } from "@/services/type.module";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { addressService } from "@/services/address/methods";
import { ResponseError } from "@/utils/axios/response-error";
import { Trash2 } from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { setOngkir, setShippingAddress } from "@/store/slices/chechkoutSlice";

interface PropsType {
  onClose: () => void;
  address: TypeShippingAddress[];
  setAddress: Dispatch<SetStateAction<TypeShippingAddress[]>>;
  selected: TypeShippingAddress | null;
}

const ModalChangeAddress: FC<PropsType> = ({
  onClose,
  address,
  setAddress,
  selected,
}) => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const handleChange = (value: TypeShippingAddress) => {
    if (value) {
      dispatch(setShippingAddress(value));
      toast.success("Berhasil mengganti alamat pengiriman");
      onClose();
    }
  };

  const handleRemove = async (addressId: string) => {
    try {
      const res = await addressService.delete(
        addressId,
        session.data?.user?.id as string
      );

      if (res.status === 200) {
        setAddress(res.data.address);
        toast.success("Berhasil menghapus alamat pengiriman");
        dispatch(setShippingAddress(res?.data?.address[0]));
        dispatch(
          setOngkir({
            desCity: res.data.address[0].city.name,
            desProvince: res.data.address[0].province.name,
            weight: "100",
          })
        );
        onClose();
      }
    } catch (error) {
      ResponseError(error);
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
                  aria-label="Ubah alamat"
                  title="Ubah detail alamat pengiriman"
                  onClick={() => handleRemove(item._id as string)}
                >
                  <Trash2 />
                </button>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default ModalChangeAddress;
