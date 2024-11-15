"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./dashboard.module.scss";

import { useSocket } from "@/context/SocketContext";

import BarChartComponent from "@/components/element/BarChart";
import { ChartArea } from "lucide-react";
import OverviewView from "@/components/views/admin/dashboard/Overview";

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
      <div className={styles.areachart}>
        <div className={styles.areachart__title}>
          <ChartArea />
          <h3>Grafik Penjualan Perbulan</h3>
        </div>
        {loading && (
          <div className={styles.loadingWrapper}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div className={styles.list} key={index}>
                <div className={styles.block_loader}></div>
                <div className={styles.block_loader}></div>
                <div className={styles.block_loader}></div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <BarChartComponent revenueData={socket?.reveneuData || []} />
        )}
      </div>
    </Fragment>
  );
};

export default DashboardPage;
