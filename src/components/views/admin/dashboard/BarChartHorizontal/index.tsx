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
    collection: string;
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
          <p>{payload[0].payload.collection}</p>
          <span>{payload[0].value}</span>
        </div>
      </div>
    );
  }
};

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const BarChartHorizontal = () => {
  const socket = useSocket();

  return (
    <ResponsiveContainer width="100%" height={250} style={{ margin: "auto" }}>
      <BarChart
        accessibilityLayer
        data={socket?.bestCollection || chartData}
        layout="vertical"
      >
        <YAxis dataKey="collection" type="category" />
        <XAxis type="number" dataKey="total" hide />
        <Tooltip
          cursor={false}
          content={<CustomTooltip active={false} payload={[]} />}
        />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartHorizontal;
