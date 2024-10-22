import React, { useEffect, useState } from "react";
import styles from "./shipping.module.scss";
import { AlertCircle, ArrowRightLeft } from "lucide-react";

import { ResponseError } from "@/utils/axios/response-error";
import { addressService } from "@/services/address/methods";
import { useSession } from "next-auth/react";
import { TypeShippingAddress } from "@/services/type.module";
import ModalAddAddress from "./ModalAddAddress";
import ModalChangeAddress from "./ModalChangeAddress";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setShippingAddress } from "@/store/slices/chechkoutSlice";
import { getOngkir } from "@/store/slices/ongkirSlice";

const ShippingView = () => {
  const session = useSession();
  const [address, setAddress] = useState<TypeShippingAddress[]>([]);
  const dispatch = useAppDispatch();
  const [isAdd, setIsAdd] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(true);
  const { address: selected, errorSubmit } = useAppSelector(
    (state) => state.check
  );

  useEffect(() => {
    const getAddress = async () => {
      try {
        const res = await addressService.get(session?.data?.user?.id as string);

        if (res.status === 200) {
          setAddress(res.data.address);
          if (res.data.address.length > 0) {
            dispatch(setShippingAddress(res.data.address[0]));
            dispatch(
              getOngkir({
                desCity: res.data.address[0].city.name,
                desProvince: res.data.address[0].province.name,
                weight: "100",
              })
            );
          }
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.data?.user?.id && address.length === 0) {
      getAddress();
    }
  }, [session?.data?.user?.id, dispatch, address.length]);

  return (
    <div
      className={styles.wrapper}
      style={{ border: errorSubmit.address ? "1px solid red" : "" }}
    >
      <h3 style={{ color: errorSubmit.address ? "red" : "" }}>
        Alamat Pengiriman
      </h3>

      {address.length === 0 && !loading && (
        <span>
          <AlertCircle width={18} height={18} /> Alamat Pengiriman anda masih
          kosong
        </span>
      )}

      <div className={styles.list}>
        {loading && (
          <>
            <div
              className={styles.skeleton}
              style={{ maxWidth: "200px", height: "0.875rem" }}
            ></div>
            <div
              className={styles.skeleton}
              style={{
                maxWidth: "250px",
                height: "0.875rem",
                marginTop: "0.5rem",
              }}
            ></div>
            <div
              className={styles.skeleton}
              style={{
                maxWidth: "250px",
                height: "0.875rem",
                marginTop: "0.5rem",
              }}
            ></div>
          </>
        )}
        {selected && !loading && (
          <>
            <div className={styles.list__contact}>
              <h4 className={loading ? styles.skeleton : ""}>
                {selected?.fullname}
              </h4>{" "}
              <small>|</small>
              <p className={styles.list__contact__phone}>{selected?.phone}</p>
            </div>
            <p className={styles.list__detail}>{selected?.address}</p>
            <div className={styles.list__address}>
              <p>{selected?.subdistrict},</p>
              <p>{selected?.city.name},</p>
              <p>{selected?.province.name},</p>
              <p>ID</p>
              <p>{selected.postalCode}</p>
            </div>
          </>
        )}
      </div>

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
      {isAdd && (
        <ModalAddAddress
          onClose={() => setIsAdd(false)}
          setAddress={setAddress}
        />
      )}
      {isChange && (
        <ModalChangeAddress
          selected={selected as TypeShippingAddress}
          onClose={() => setIsChange(false)}
          address={address as TypeShippingAddress[]}
          setAddress={setAddress}
        />
      )}
    </div>
  );
};

export default ShippingView;
