const isProduction = process.env.NEXT_PUBLIC_MODE === "production";
import moment from "moment-timezone";

export const ServerURL = isProduction
  ? `http://los-blancos.vercel.app${process.env.NEXT_PUBLIC_BASE_URL}`
  : `http://localhost:3000${process.env.NEXT_PUBLIC_BASE_URL}`;

export const formatCurrency = (value: number) => {
  return Intl.NumberFormat("id-Id", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency: "IDR",
    style: "currency",
  }).format(value);
};

export const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(
    2,
    "0"
  )} : ${String(seconds).padStart(2, "0")}`;
};

export const formateDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "numeric",
    minute: "numeric",
  });
};

export function formatDateToMidtrans() {
  return moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss ZZ");
}
