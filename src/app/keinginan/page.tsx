import WishlistMainView from "@/components/views/wishlist/WishlistMainView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keinginan Saya",
  description: "Daftar Keinginan Saya",
  openGraph: {
    title: "Keinginan Saya",
    description: "Daftar Keinginan Saya",
    type: "website",
    locale: "id_ID",
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/keinginan`,
  },
};

const WishListPage = () => {
  return <WishlistMainView />;
};

export default WishListPage;
