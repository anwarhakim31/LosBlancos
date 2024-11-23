/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatCurrency } from "@/utils/contant";
import styles from "./chart.module.scss";

import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  YAxis,
  Legend,
} from "recharts";
import { useSocket } from "@/context/SocketContext";

const CustomTooltip = ({
  active,
  payload,
}: {
  active: boolean;
  payload: any;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <h5 className={styles.label}>{payload[0].payload.month}</h5>
        <div className={styles.tooltip__list}>
          <p className={styles.label}>Transaksi</p>
          <span className={styles.value}>{payload[0].value}</span>
        </div>
        <div className={styles.tooltip__list}>
          <p className={styles.label}>Produk</p>
          <span className={styles.value}>{payload[1].value}</span>
        </div>
        <div className={styles.tooltip__list}>
          <p className={styles.label}>Pendapatan</p>
          <span className={styles.value}>
            {formatCurrency(payload[2].value)}
          </span>
        </div>
      </div>
    );
  }
};

const BarChartComponent = () => {
  const socket = useSocket();

  if (socket?.loading) {
    return (
      <div className={styles.loadingWrapper}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className={styles.list} key={index}>
            <div className={styles.block_loader}></div>

            <div className={styles.block_loader}></div>
            <div className={styles.block_loader}></div>
          </div>
        ))}
      </div>
    );
  }

  if (socket?.reveneuData && socket?.reveneuData.length === 0) {
    <div
      style={{
        width: "100%",
        height: "250px",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <p>Belum ada data</p>
    </div>;
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={275}
      style={{ marginTop: "1rem" }}
    >
      <BarChart
        data={socket?.reveneuData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="0.1 0.1" />
        <XAxis
          dataKey="month"
          interval={2}
          textAnchor="end"
          style={{ fontSize: "0.6215rem" }}
        />
        <YAxis yAxisId="left" style={{ fontSize: "0.6215rem" }} />
        <YAxis
          yAxisId="right"
          orientation="right"
          style={{ display: "none" }}
        />
        {socket?.reveneuData && socket?.reveneuData.length > 0 && (
          <Tooltip content={<CustomTooltip active={true} payload={[]} />} />
        )}
        <Legend iconSize={10} wrapperStyle={{ fontSize: "0.75rem" }} />
        <Bar
          yAxisId="left"
          dataKey="transaction"
          fill="#8884d8"
          barSize={20}
          radius={4}
        />

        <Bar
          yAxisId="left"
          dataKey="product"
          fill="#ffc658"
          barSize={20}
          radius={4}
        />

        <Bar
          yAxisId="right"
          dataKey="income"
          fill="#82ca9d"
          barSize={20}
          radius={4}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
