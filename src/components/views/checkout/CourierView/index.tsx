import React, { useEffect, useState } from "react";
import styles from "./courier.module.scss";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { AlertCircle, ArrowRightLeft } from "lucide-react";
import { formatCurrency } from "@/utils/contant";
import Image from "next/image";
import ModalChangeOngkir from "./ModalChangeOngkir";
import { setLoading } from "@/store/slices/ongkirSlice";
import { removeShippingAddress } from "@/store/slices/chechkoutSlice";

export function splitEstimated(est: string) {
  return est?.split("hari")[0];
}

const CourierView = ({ isLoading }: { isLoading: boolean }) => {
  const dispatch = useAppDispatch();
  const { address, costs, loading, errorSubmit } = useAppSelector(
    (state) => state.check
  );
  const { loading: loadingOngkir, error: errOngkir } = useAppSelector(
    (state) => state.ongkir
  );
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(removeShippingAddress());
  }, [dispatch]);

  return (
    <div
      className={`${styles.wrapper} ${
        address && costs && !loading ? styles.select : styles.noselect
      }`}
      onClick={() => (address ? setIsChange(true) : null)}
      style={{
        border: errorSubmit.ongkir ? "1px solid red" : "",
        cursor: !errOngkir ? "pointer" : " not-allowed",
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      <h3 style={{ color: errorSubmit.ongkir ? "red" : "" }}>
        Jasa Pengiriman
      </h3>
      <div className={styles.container}>
        {!loadingOngkir && !costs && (
          <span>
            <AlertCircle width={18} height={18} /> Alamat Pengiriman anda masih
            kosong
          </span>
        )}

        <div className={styles.courier}>
          {loadingOngkir && (
            <>
              <div
                className={styles.skeleton}
                style={{
                  width: "50px",
                  height: "0.875rem",
                }}
              ></div>
              <div
                className={styles.skeleton}
                style={{
                  width: "100px",
                  height: "0.875rem",
                  marginTop: "0.5rem",
                }}
              ></div>
            </>
          )}
          {!loadingOngkir && costs && (
            <>
              <h4>{costs?.courier}</h4>
              <p>{costs?.service.split("Pos")}</p>
            </>
          )}
        </div>
        {loadingOngkir && (
          <div
            className={styles.skeleton}
            style={{
              maxWidth: "100px",
              height: "1.1rem",
              marginBottom: "auto",
            }}
          ></div>
        )}
        {!loadingOngkir && costs && (
          <h4 className={styles.cost}>
            {formatCurrency((costs?.cost[0].value as number) || 0)}
          </h4>
        )}
      </div>
      <div className={styles.footer}>
        {loadingOngkir ? (
          <div
            className={styles.skeleton}
            style={{
              maxWidth: "120px",
              height: "1.1rem",
              marginBottom: "auto",
            }}
          ></div>
        ) : (
          <>
            <Image src="/truck.png" alt="courier" width={30} height={18} />
            <p>
              Estimasi tiba{" "}
              {loading
                ? "0"
                : costs?.cost[0].etd.startsWith("0")
                ? "ini"
                : costs?.cost[0].etd.split("HARI")}{" "}
              hari
            </p>
          </>
        )}
      </div>
      {address && costs && (
        <button
          className={styles.switch}
          onClick={() => setIsChange(true)}
          aria-label="switch"
          title="Ganti Alamat Pengiriman"
          disabled={loadingOngkir}
          style={{
            display: address ? "block" : "none",
          }}
        >
          <ArrowRightLeft />
        </button>
      )}

      {isChange && <ModalChangeOngkir onClose={() => setIsChange(false)} />}
    </div>
  );
};

export default CourierView;
