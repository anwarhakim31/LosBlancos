const isProduction = process.env.NEXT_PUBLIC_MODE === "production";

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
  const now = new Date();

  now.setHours(now.getHours() + 7);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} +0700`;

  return formattedDate;
}
export const youtubeid = (url: string) => {
  return url.split("=")[1];
};

export const formatDateMessage = (date: Date) => {
  const now = new Date();
  const messageData = new Date(date);
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfDate = new Date(
    messageData.getFullYear(),
    messageData.getMonth(),
    messageData.getDate()
  );

  const differenceInTime = startOfToday.getTime() - startOfDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  if (differenceInDays === 0) {
    return "Hari ini";
  } else if (differenceInDays === 1) {
    return "1 hari lalu";
  } else {
    return `${differenceInDays} hari lalu`;
  }
};
