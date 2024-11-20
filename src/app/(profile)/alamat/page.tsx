import AlamatMainView from "@/components/views/profile/alamat/AlamatMainView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alamat Pengiriman Saya",
  description: "Alamat Pengiriman",
  openGraph: {
    title: "Alamat Pengiriman",
    description: "Alamat Pengiriman",
    type: "website",
    locale: "id_ID",
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/alamat`,
  },
};

const MyAddressPage = () => {
  return <AlamatMainView />;
};

export default MyAddressPage;
