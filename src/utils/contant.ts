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
