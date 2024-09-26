"use client";

import React from "react";
import styles from "./sidebar.module.scss";
import Image from "next/image";
import Link from "next/link";

import { BoxesIcon, LayoutDashboard, User } from "lucide-react";
import { usePathname } from "next/navigation";

const sideList = [
  {
    id: 1,
    name: "Dashboard",
    icon: <LayoutDashboard width={20} height={20} strokeWidth={2} />,
    link: "/admin/dashboard",
  },
  {
    id: 2,
    name: "User",
    icon: <User width={20} height={20} strokeWidth={2} />,
    link: "/admin/user",
  },
  {
    id: 3,
    name: "Produk",
    icon: <BoxesIcon width={20} height={20} strokeWidth={1} />,
    link: "/admin/product",
  },
];

const Sidebar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`${styles.sidebar} ${
        isSidebarOpen ? styles["sidebar__active"] : ""
      }`}
    >
      <div className={styles.sidebar__logo}>
        <Image src={"/logo.svg"} alt="logo" width={70} height={70} priority />
        {/* <h3>LosBlancos</h3> */}
      </div>
      <div className={styles.sidebar__primaryList}>
        {sideList.map((item) => (
          <Link
            href={item.link}
            className={`${styles.sidebar__primaryList__item} ${
              pathname === item.link &&
              styles["sidebar__primaryList__item__active"]
            }`}
            key={item.id}
          >
            <span className={styles.sidebar__primaryList__item__icon}>
              {item.icon}
            </span>
            <span className={styles.sidebar__primaryList__item__name}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
