import React, { useEffect, useState } from "react";
import styles from "./view.module.scss";
import AnimateCounter from "@/components/element/AnimateCounter";
import { ArrowRightLeft, Boxes, Users2, Wallet } from "lucide-react";
import { useSocket } from "@/context/SocketContext";

const OverviewView: React.FC = () => {
  const socket = useSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket?.socket) {
      setLoading(false);
    }
  }, [socket]);

  return (
    <div className={styles.overview}>
      <div className={styles.overview__boxes}>
        <div className={styles.overview__boxes__context}>
          <p>Total Pendapatan</p>
          <h1>
            {loading ? (
              <div className={styles.loader}></div>
            ) : (
              <AnimateCounter
                value={socket?.statistik?.totalIncome || 0}
                type="currency"
              />
            )}
          </h1>
        </div>
        <div className={`${styles.overview__boxes__icon} ${styles.income}`}>
          <Wallet />
        </div>
      </div>
      <div className={styles.overview__boxes}>
        <div className={styles.overview__boxes__context}>
          <p>Produk Terjual</p>
          {loading ? (
            <div className={styles.loader}></div>
          ) : (
            <h1>
              <AnimateCounter
                value={socket?.statistik.totalProduct || 0}
                type="number"
              />
            </h1>
          )}
        </div>
        <div className={`${styles.overview__boxes__icon} ${styles.product}`}>
          <Boxes />
        </div>
      </div>
      <div className={styles.overview__boxes}>
        <div className={styles.overview__boxes__context}>
          <p>Transaksi Dibayar</p>
          {loading ? (
            <div className={styles.loader}></div>
          ) : (
            <h1>
              {" "}
              <AnimateCounter
                value={socket?.statistik.totalTransaction || 0}
                type="number"
              />
            </h1>
          )}
        </div>
        <div
          className={`${styles.overview__boxes__icon} ${styles.transaction}`}
        >
          <ArrowRightLeft />
        </div>
      </div>
      <div className={styles.overview__boxes}>
        <div className={styles.overview__boxes__context}>
          <p>Pelanggan Online</p>
          {loading ? (
            <div className={styles.loader}></div>
          ) : (
            <h1>
              <AnimateCounter
                value={socket?.userOnline?.length || 0}
                type="number"
              />
            </h1>
          )}
          <span>
            Total{" "}
            {loading ? (
              <p className={styles.smallLoader}></p>
            ) : (
              <AnimateCounter
                value={socket?.statistik.totalUser || 0}
                type="number"
              />
            )}
          </span>
        </div>
        <div className={`${styles.overview__boxes__icon} ${styles.user}`}>
          <Users2 />
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
