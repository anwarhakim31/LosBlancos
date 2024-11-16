"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment } from "react";
import styles from "./dashboard.module.scss";

// import { useSocket } from "@/context/SocketContext";

import BarChartComponent from "@/components/views/admin/dashboard/BarChart";
import { BarChart3Icon, BarChartHorizontalBig, ChartPie } from "lucide-react";
import OverviewView from "@/components/views/admin/dashboard/Overview";
import BestSellerView from "@/components/views/admin/dashboard/BestSaller";
import SimplePieCart from "@/components/views/admin/dashboard/SimplePieCart";
import BarChartHorizontal from "@/components/views/admin/dashboard/BarChartHorizontal";

const DashboardPage = () => {
  // const socket = useSocket();

  return (
    <Fragment>
      <HeaderPage title="Dashboard" description="" />
      <OverviewView />
      <div className={styles.wrapper}>
        <div className={styles.barchart}>
          <div className={styles.titlechart}>
            <BarChart3Icon />
            <h3>Grafik Penjualan Perbulan</h3>
          </div>

          <BarChartComponent />
        </div>
        <BestSellerView />
      </div>

      <div className={styles.wrapper2}>
        <div className={styles.wrapper2__list}>
          <div className={styles.titlechart}>
            <ChartPie />
            <h3>Grafik Koleksi Terlaris </h3>
          </div>
          <SimplePieCart />
        </div>
        <div className={styles.wrapper2__list}>
          <div className={styles.titlechart}>
            <BarChartHorizontalBig />
            <h3>Grafik Rating Produk</h3>
          </div>
          <BarChartHorizontal />
        </div>
        <div className={styles.wrapper2__list}></div>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
