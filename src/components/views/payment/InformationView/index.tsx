import { AlertCircle } from "lucide-react";
import React from "react";
import styles from "./info.module.scss";
import { TypeTransaction } from "@/services/type.module";

const InformationView: React.FC<{
  loading: boolean;
  data: TypeTransaction;
  setIsCancel: React.Dispatch<React.SetStateAction<boolean>>;
  countdown: number;
}> = ({ loading, data, setIsCancel, countdown }) => {
  return (
    <div className={styles.right}>
      <div className={styles.info}>
        <div className={styles.info__logo}>
          <p>
            Dijamin <br />
            <span>Aman</span>
          </p>
        </div>
        <AlertCircle fill="blue" color="white" />

        <p className={styles.info__text}>Transaksi ini dijamin aman</p>
      </div>

      <div className={styles.note}>
        {loading ? (
          <>
            <div
              className={styles.skeleton}
              style={{
                height: "1.5rem",
                width: "100px",
                marginBottom: "1.25rem",
              }}
            ></div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={styles.skeleton}
                style={{
                  maxWidth: "250px",
                  height: "1rem",
                  marginBottom: "0.35rem",
                }}
              ></div>
            ))}
          </>
        ) : (
          <>
            <h3>Catatan</h3>
            <ol className={styles.note__primaryList}>
              {data?.paymentMethod === "bank_transfer" && (
                <li>Salin Nomor Transaksi untuk melakukan pembayaran</li>
              )}
              {data?.paymentMethod === "over_thecounter" && (
                <li>Berikan Nomor Pembayaran ke kasir</li>
              )}
              {data?.paymentName === "gopay" ||
                (data?.paymentName === "shopeepay" && (
                  <li>
                    Klik Koneksi dan akan mengarahkan ke e-wallet untuk
                    pembayaran
                  </li>
                ))}
              {data?.paymentName === "qris" && <li>Scan QR Code </li>}
              <li>
                Halaman tidak perlu kamu refresh, status transaksi akan update
                otomatis.
              </li>
              <li>Selesaikan pembayaran sebelum batas waktu.</li>
              <li>Bayar sesuai nominal yang tertera</li>
              <li>Jika perlu bantuan, chat ke WA Admin</li>
            </ol>
          </>
        )}
      </div>
      <button
        className={styles.button}
        type="button"
        disabled={loading}
        aria-label="Batalkan"
        style={{ marginTop: "2rem", marginLeft: "auto" }}
        onClick={() => setIsCancel(true)}
      >
        {loading ? "loading" : countdown === 0 ? "Kembali" : "Batalkan"}
      </button>
    </div>
  );
};

export default InformationView;
