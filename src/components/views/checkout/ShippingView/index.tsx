import React, { useEffect, useState } from "react";
import styles from "./shipping.module.scss";
import { AlertCircle, ArrowRightLeft } from "lucide-react";

import { ResponseError } from "@/utils/axios/response-error";
import { addressService } from "@/services/address/methods";
import { useSession } from "next-auth/react";
import { TypeShippingAddress } from "@/services/type.module";
import ModalAddAddress from "./ModalAddAddress";
import ModalChangeAddress from "./ModalChangeAddress";

const ShippingView = () => {
  const session = useSession();
  const [address, setAddress] = useState([]);
  const [selected, setSelected] = useState<TypeShippingAddress | null>(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    const getAddress = async () => {
      try {
        const res = await addressService.get(session?.data?.user?.id as string);

        if (res.status === 200) {
          setAddress(res.data.address);
          setSelected(res.data.address[0]);
        }
      } catch (error) {
        ResponseError(error);
      }
    };

    if (session?.data?.user?.id) {
      getAddress();
    }
  }, [session?.data?.user?.id]);

  return (
    <div className={styles.wrapper}>
      <h3>Alamat Pengiriman</h3>
      {address.length === 0 && (
        <span>
          <AlertCircle width={18} height={18} /> Alamat Pengiriman anda masih
          kosong
        </span>
      )}
      {selected && (
        <div className={styles.list}>
          <div className={styles.list__contact}>
            <h4>{selected?.fullname}</h4> <small>|</small>
            <p className={styles.list__contact__phone}>{selected?.phone}</p>
          </div>
          <p className={styles.list__detail}>{selected?.address}</p>
          <div className={styles.list__address}>
            <p>{selected.subdistrict},</p>
            <p>{selected.city.name},</p>
            <p>{selected.province.name},</p>
            <p>ID</p>
            <p>{selected.postalCode}</p>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          aria-label="tambah alamat"
          onClick={() => setIsAdd(true)}
          style={{
            display: address.length > 2 ? "none" : "block",
          }}
        >
          Tambah
        </button>
      </div>
      <button
        className={styles.switch}
        onClick={() => setIsChange(true)}
        aria-label="switch"
        title="Ganti Alamat Pengiriman"
        style={{
          display: address.length > 1 ? "block" : "none",
        }}
      >
        <ArrowRightLeft />
      </button>
      {isAdd && <ModalAddAddress onClose={() => setIsAdd(false)} />}
      {isChange && (
        <ModalChangeAddress
          onClose={() => setIsChange(false)}
          address={address as TypeShippingAddress[]}
          setSelected={setSelected}
        />
      )}
    </div>
  );
};

export default ShippingView;
