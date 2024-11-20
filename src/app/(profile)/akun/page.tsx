import AkunMainView from "@/components/views/profile/akun/AkunMainView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Akun Saya",
  description: "Kelola informasi akun saya",
  openGraph: {
    title: "Profil Akun Saya",
    description: "Kelola informasi akun saya",
    type: "website",
    locale: "id_ID",
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/pesanan`,
  },
};

const MyAccountPage = () => {
  return <AkunMainView />;
};

export default MyAccountPage;
