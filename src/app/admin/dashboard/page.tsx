"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./dashboard.module.scss";

import { useSocket } from "@/context/SocketContext";

import BarChartComponent from "@/components/element/BarChart";
import { ChartArea } from "lucide-react";
import OverviewView from "@/components/views/admin/dashboard/Overview";
import BestSellerView from "@/components/views/admin/dashboard/BestSaller";

const DashboardPage = () => {
  const socket = useSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket?.socket) {
      setLoading(false);
    }
  }, [socket]);

  return (
    <Fragment>
      <HeaderPage title="Dashboard" description="" />
      <OverviewView />
      <div className={styles.wrapper}>
        <div className={styles.barchart}>
          <div className={styles.titlechart}>
            <ChartArea />
            <h3>Grafik Penjualan Perbulan</h3>
          </div>

          <BarChartComponent
            revenueData={socket?.reveneuData || []}
            loading={loading}
          />
        </div>
        <BestSellerView />
      </div>

      <div className={styles.wrapper2}>
        <div className={styles.wrapper2__list}></div>
        <div className={styles.wrapper2__list}></div>
        <div className={styles.wrapper2__list}></div>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
