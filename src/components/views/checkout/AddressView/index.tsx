import React, { useEffect, useState } from "react";
import styles from "./shipping.module.scss";
import { AlertCircle, ArrowRightLeft } from "lucide-react";

import { ResponseError } from "@/utils/axios/response-error";
import { addressService } from "@/services/address/methods";
import { useSession } from "next-auth/react";
import { TypeShippingAddress } from "@/services/type.module";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setShippingAddress } from "@/store/slices/chechkoutSlice";
import { getOngkir } from "@/store/slices/ongkirSlice";
import { setLoading as setLoadingOngkir } from "@/store/slices/ongkirSlice";
import dynamic from "next/dynamic";

const ModalChangeAddress = dynamic(() => import("./ModalChangeAddress"), {
  ssr: false,
});
const ModalAddAddress = dynamic(
  () => import("../../../fragments/ModalAddAddress"),
  {
    ssr: false,
  }
);

const AddressView = ({
  isLoading,
  transactionId,
}: {
  isLoading: boolean;
  transactionId: string;
}) => {
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
          dispatch(setLoadingOngkir(true));
          if (res.data.address.length > 0) {
            dispatch(setShippingAddress(res.data.address[0]));
            dispatch(
              getOngkir({
                desCity: res.data.address[0].city.name,
                desProvince: res.data.address[0].province.name,
                transactionId: transactionId,
              })
            );
          } else if (res.data.address.length === 0) {
            dispatch(setLoadingOngkir(false));
          }
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.data?.user?.id) {
      getAddress();
    }
  }, [session?.data?.user?.id, dispatch, transactionId]);

  return (
    <div
      className={styles.wrapper}
      style={{
        border: errorSubmit.address ? "1px solid red" : "",
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      <h3 style={{ color: errorSubmit.address ? "red" : "" }}>
        Alamat Pengiriman
      </h3>

      {address.length === 0 && !loading ? (
        <span>
          <AlertCircle width={18} height={18} /> Alamat Pengiriman anda masih
          kosong
        </span>
      ) : null}

      <div className={styles.list}>
        {loading ? (
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
        ) : null}
        {selected && !loading ? (
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
        ) : null}
      </div>

      <div className={styles.footer}>
        {loading ? (
          <div
            className={styles.skeleton}
            style={{
              maxWidth: "75px",
              height: "2rem",
              marginLeft: "auto",
            }}
          ></div>
        ) : (
          <button
            type="button"
            aria-label="tambah alamat"
            disabled={loading}
            onClick={() => setIsAdd(true)}
            style={{
              display: address.length > 2 ? "none" : "block",
            }}
          >
            Tambah
          </button>
        )}
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
          transactionId={transactionId}
        />
      )}
      {isChange && (
        <ModalChangeAddress
          selected={selected as TypeShippingAddress}
          onClose={() => setIsChange(false)}
          address={address as TypeShippingAddress[]}
          setAddress={setAddress}
          transactionId={transactionId}
        />
      )}
    </div>
  );
};

export default AddressView;
