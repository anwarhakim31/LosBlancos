import PesananMainView from "@/components/views/profile/pesanan/PesananMainView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pesanan Belanja Saya",
  description: "Masuk dengan akun anda untuk berbelanja",
  openGraph: {
    title: "Pesanan Belanja Saya",
    description: "Masuk dengan akun anda untuk berbelanja",
    type: "website",
    locale: "id_ID",
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/pesanan`,
  },
};

const OrderPage = () => {
  return <PesananMainView />;
};

export default OrderPage;
