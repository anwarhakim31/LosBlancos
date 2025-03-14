import { useSocket } from "@/context/SocketContext";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./chart.module.scss";

interface PayloadItem {
  payload: {
    range: string;
  };
  collection: string;
  value: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active: boolean;
  payload: PayloadItem[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltip__list}>
          <p>{payload[0].payload.range}</p>
          <span>{payload[0].value}</span>
        </div>
      </div>
    );
  }
};

const BarChartHorizontal = () => {
  const socket = useSocket();

  if (socket?.loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div
          className={styles.loader}
          style={{ width: "100%", height: "20px" }}
        ></div>
        <div
          className={styles.loader}
          style={{ width: "50%", height: "20px" }}
        ></div>
        <div
          className={styles.loader}
          style={{ width: "70%", height: "20px" }}
        ></div>
      </div>
    );
  }

  if (socket?.reveneuData && socket?.ratingProduct.length === 0) {
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
      height={270}
      style={{ marginTop: "1rem" }}
    >
      <BarChart
        data={socket?.ratingProduct || []}
        layout="vertical"
        barCategoryGap={"20%"}
        barGap={5}
      >
        <YAxis
          dataKey="range"
          type="category"
          style={{ fontSize: "0.6125rem" }}
          axisLine={false}
          tickLine={false}
        />
        <XAxis type="number" dataKey="total" hide />
        <Tooltip
          cursor={false}
          content={<CustomTooltip active={false} payload={[]} />}
        />
        <Bar dataKey="total" barSize={20} radius={4} fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartHorizontal;
