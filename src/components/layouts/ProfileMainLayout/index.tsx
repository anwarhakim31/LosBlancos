"use client";

import React, { Fragment } from "react";

import styles from "./profile.module.scss";
import BreadCrubm from "@/components/element/BreadCrubm";
import { CircleUser, LogOut, Map, ShoppingBag } from "lucide-react";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useAppSelector } from "@/store/hook";
import { usePathname, useRouter } from "next/navigation";

const menu = [
  {
    name: "Akun Saya",
    icon: <CircleUser color="blue" />,
    url: "/akun",
  },
  {
    name: "Alamat Saya",
    icon: <Map color="green" />,
    url: "/alamat",
  },
  {
    name: "Pesanan Saya",
    icon: <ShoppingBag color="purple" />,
    url: "/pesanan",
  },
  {
    name: "keluar",
    icon: <LogOut color="red" />,
    url: "/keluar",
  },
];

const ProfileMainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data } = useSession();
  const { cart } = useAppSelector((state) => state.cart);

  const pathname = usePathname();

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
                    pathname === item.url ? styles.active : ""
                  }`}
                  type="button"
                  aria-label={item.name}
                  key={index}
                  onClick={() => {
                    if (item.name === "keluar") {
                      signOut({
                        callbackUrl: "/login",
                      });
                    } else {
                      router.push(item.url, {
                        scroll: false,
                      });
                    }
                  }}
                >
                  {item.icon} <p>{item.name}</p>
                </button>
              ))}
            </div>
            <div className={styles.content}>{children}</div>
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default ProfileMainLayout;
