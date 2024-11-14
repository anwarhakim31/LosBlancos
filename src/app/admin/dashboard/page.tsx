"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment } from "react";
import styles from "./dashboard.module.scss";
import { ArrowRightLeft, Boxes, Users2, Wallet } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import { formatCurrency } from "@/utils/contant";

const DashboardPage = () => {
  const socket = useSocket();

  return (
    <Fragment>
      <HeaderPage title="Dashboard" description="" />
      <div className={styles.overview}>
        <div className={styles.overview__boxes}>
          <div className={styles.overview__boxes__context}>
            <p>Pendapatan</p>
            <h1>{formatCurrency(0)}</h1>
            <span>Perbulan</span>
          </div>
          <div className={`${styles.overview__boxes__icon} ${styles.income}`}>
            <Wallet />
          </div>
        </div>
        <div className={styles.overview__boxes}>
          <div className={styles.overview__boxes__context}>
            <p>Produk Terjual</p>
            <h1>0</h1>
            <span> </span>
          </div>
          <div className={`${styles.overview__boxes__icon} ${styles.product}`}>
            <Boxes />
          </div>
        </div>
        <div className={styles.overview__boxes}>
          <div className={styles.overview__boxes__context}>
            <p>Transaksi Dibayar</p>
            <h1>0</h1>
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
            <h1>{socket?.userOnline?.length}</h1>
            <span>Total 100</span>
          </div>
          <div className={`${styles.overview__boxes__icon} ${styles.user}`}>
            <Users2 />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
