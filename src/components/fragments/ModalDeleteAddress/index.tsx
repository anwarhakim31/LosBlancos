/* eslint-disable @typescript-eslint/no-explicit-any */

import styles from "./modal.module.scss";

import { TriangleAlert } from "lucide-react";
import ButtonClick from "@/components/element/ButtonClick";
import { Dispatch, SetStateAction, useState } from "react";
import { ResponseError } from "@/utils/axios/response-error";
import { toast } from "sonner";
import PortalNotification from "@/components/element/PortalNotification";
import { addressService } from "@/services/address/methods";
import { useSession } from "next-auth/react";
import { TypeShippingAddress } from "@/services/type.module";

const ModalDeleteAddress = ({
  onClose,
  data,
  setAddress,
}: {
  onClose: () => void;
  data: TypeShippingAddress;
  setAddress: Dispatch<SetStateAction<TypeShippingAddress[]>>;
}) => {
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await addressService.delete(
        data?._id as string,
        session?.data?.user?.id as string
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        setAddress(res.data.address);
        onClose();
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalNotification onClose={() => {}}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__content}>
          <TriangleAlert />
          <p>Apakah anda yakin ingin menghapus alamat ini?</p>
        </div>

        <div className={styles.modal__footer}>
          <div style={{ width: "100px" }}>
            <ButtonClick title="Tidak" onClick={onClose} loading={loading} />
          </div>
          <div style={{ width: "100px" }}>
            <ButtonClick title="Ya" loading={loading} onClick={handleDelete} />
          </div>
        </div>
      </div>
    </PortalNotification>
  );
};

export default ModalDeleteAddress;
