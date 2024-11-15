/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "./chart.module.scss";

import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

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
          <p className={styles.label}>Produk</p>
          <small className={styles.value}>{payload[1].value}</small>
        </div>
        <div className={styles.tooltip__list}>
          <p className={styles.label}>Produk</p>
          <small className={styles.value}>{payload[1].value}</small>
        </div>
        <div className={styles.tooltip__list}>
          <p className={styles.label}>Pendapatan</p>
          <small className={styles.value}>{payload[2].value}</small>
        </div>
      </div>
    );
  }
};

const BarChartComponent = ({
  revenueData,
}: {
  revenueData: {
    month: string;
    income: number;
    transaction: number;
    product: number;
  }[];
}) => {
  return (
    <ResponsiveContainer
      width="100%"
      height={250}
      style={{ marginTop: "1rem" }}
    >
      <BarChart
        data={revenueData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="0.1 0.1" />
        <XAxis
          dataKey="month"
          interval="preserveStartEnd"
          textAnchor="end"
          style={{ fontSize: "0.6215rem" }}
        />

        <YAxis yAxisId="left" style={{ fontSize: "0.6215rem" }} />
        <YAxis
          yAxisId="right"
          orientation="right"
          style={{ display: "none" }}
        />
        {revenueData.length > 0 && (
          <Tooltip content={<CustomTooltip active={true} payload={[]} />} />
        )}

        <Bar
          yAxisId="left"
          dataKey="product"
          fill="#ffc658"
          barSize={20}
          radius={4}
        />

        <Bar
          yAxisId="left"
          dataKey="transaction"
          fill="#82ca9d"
          barSize={20}
          radius={4}
        />

        <Bar
          yAxisId="right"
          dataKey="income"
          fill="#8884d8"
          barSize={20}
          radius={4}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
