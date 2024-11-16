import { useSocket } from "@/context/SocketContext";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./chart.module.scss";

interface PayloadItem {
  payload: {
    date: string;
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
          <p>{payload[0].payload.date}</p>
          <span>{payload[0].value}</span>
        </div>
      </div>
    );
  }
};

const LineChartComponent = () => {
  const socket = useSocket();

  if (socket?.loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.skeleton + " " + styles.skeleton_line1}></div>
      </div>
    );
  }

  if (socket?.reveneuData && socket?.userGrowth.length === 0) {
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

  if (socket?.userGrowth.length === 0) {
    return (
      <div className={styles.empty}>
        <p>There is no data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={270}
      style={{ marginTop: "1rem", maxWidth: "450px" }}
    >
      <LineChart data={socket?.userGrowth || []}>
        <YAxis
          dataKey="count"
          style={{ fontSize: "0.6125rem" }}
          domain={["auto", "auto"]}
          tickFormatter={(value: number) => Math.round(value).toString()}
        />
        <XAxis dataKey="date" style={{ fontSize: "0.6125rem" }} />
        <Tooltip
          cursor={false}
          content={<CustomTooltip active={false} payload={[]} />}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#ffc658"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
