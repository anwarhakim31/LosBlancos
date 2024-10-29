"use client";

import BreadCrubm from "@/components/element/BreadCrubm";
import { signOut, useSession } from "next-auth/react";
import styles from "./profile.module.scss";

import React, { Fragment, useState } from "react";
import Footer from "@/components/layouts/Footer";
import { useAppSelector } from "@/store/hook";
import Link from "next/link";
import { CircleUser, LogOut, Map } from "lucide-react";
import MyAccountView from "@/components/views/profile/AccountView";

const menu = [
  {
    name: "Akun Saya",
    icon: <CircleUser color="blue" />,
  },
  {
    name: "Alamat Saya",
    icon: <Map color="green" />,
  },
  {
    name: "keluar",
    icon: <LogOut color="red" />,
  },
];

const ProfilPage = () => {
  const { data } = useSession();
  const { cart } = useAppSelector((state) => state.cart);
  const [isActive, setIsActive] = useState("Akun Saya");

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <BreadCrubm />
          <div className={styles.header}>
            <h1>
              Selamat Datang <span>{data?.user?.name}</span>
            </h1>
            {cart?.items?.length > 0 ? (
              <p>
                Anda memiliki {cart?.items?.length} produk di keranjang,{" "}
                <Link href="/keranjang">Lihat Keranjang</Link>
              </p>
            ) : (
              <p>
                Anda tidak memiliki pesanan di keranjang,{" "}
                <Link href="/produk">Pesan Sekarang</Link>
              </p>
            )}
          </div>
          <div className={styles.wrapper}>
            <div className={styles.menu}>
              {menu.map((item, index) => (
                <button
                  className={`${styles.menu__list} ${
                    isActive === item.name ? styles.active : ""
                  }`}
                  type="button"
                  aria-label={"Akun Saya"}
                  key={index}
                  onClick={() => {
                    if (item.name === "keluar") {
                      signOut({
                        callbackUrl: "/login",
                      });
                    } else {
                      setIsActive(item.name);
                    }
                  }}
                >
                  {item.icon} <p>{item.name}</p>
                </button>
              ))}
            </div>
            <div className={styles.content}>
              {isActive === "Akun Saya" && <MyAccountView />}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default ProfilPage;
