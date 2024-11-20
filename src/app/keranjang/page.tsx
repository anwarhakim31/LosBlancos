import CartMainView from "@/components/views/cart/CartMainView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keranjang Belanja Saya",
  description: "Keranjang Belanja Saya",
  openGraph: {
    title: "Keranjang Belanja Saya",
    description: "Keranjang Belanja Saya",
    type: "website",
    locale: "id_ID",
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/keranjang`,
  },
};

const CartPage = () => {
  return <CartMainView />;
};

export default CartPage;
