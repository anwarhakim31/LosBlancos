"use client";

import React, { ForwardedRef, forwardRef, Fragment, useState } from "react";
import styles from "./sidebar.module.scss";
import Image from "next/image";
import Link from "next/link";
import {
  AlignHorizontalSpaceAround,
  ChevronDown,
  Layers3,
  LayoutDashboard,
  LibraryBig,
  MonitorCog,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useMasterContext } from "@/context/MasterContext";

const sideList = [
  {
    id: 1,
    name: "dashboard",
    icon: <LayoutDashboard width={20} height={20} strokeWidth={1.5} />,
    link: "/admin/dashboard",
  },
  {
    id: 2,
    name: "master data",
    icon: <MonitorCog width={20} height={20} strokeWidth={1.5} />,
    dropdown: [
      {
        id: 1,
        name: "Logo & Link",
        link: "/admin/master-data/logo-link",
      },
      {
        id: 2,
        name: "Desain",
        link: "/admin/master-data/desain",
      },
    ],
  },
  {
    id: 3,
    name: "user",
    icon: <User width={20} height={20} strokeWidth={1.5} />,
    link: "/admin/user",
  },

  {
    id: 4,
    name: "Atribut",
    icon: <AlignHorizontalSpaceAround width={20} height={20} strokeWidth={1} />,
    link: "/admin/attribute",
  },
  {
    id: 5,
    name: "kategori",
    icon: <Layers3 width={20} height={20} strokeWidth={1} />,
    link: "/admin/category",
  },
  {
    id: 6,
    name: "Koleksi",
    icon: <LibraryBig width={20} height={20} strokeWidth={1} />,
    link: "/admin/collection",
  },
  {
    id: 7,
    name: "produk",
    icon: <Package width={20} height={20} strokeWidth={1.2} />,
    link: "/admin/product",
  },

  {
    id: 8,
    name: "transaksi",
    icon: <ShoppingBag width={20} height={20} strokeWidth={1.2} />,
    link: "/admin/transaction",
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ isSidebarOpen }: SidebarProps, ref: ForwardedRef<HTMLDivElement>) => {
    const context = useMasterContext();
    const pathname = usePathname();
    const [selected, setSelected] = useState(
      pathname.split("-").join(" ").split("/")[2]
    );

    return (
      <aside
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles["sidebar__active"] : ""
        }`}
        ref={ref}
      >
        <div className={styles.sidebar__logo}>
          {context?.master.displayLogo ? (
            <Image
              src={context?.master.logo || "/default.png"}
              alt="logo"
              width={100}
              height={100}
              priority
            />
          ) : null}
          {context?.master.displayName ? (
            <p
              style={{
                color: context?.master.color,
                fontWeight: "600",
                fontSize: "1.25rem",
              }}
            >
              {context?.master.name}
            </p>
          ) : null}
        </div>
        <div className={styles.sidebar__primaryList}>
          {sideList.map((item) => (
            <Fragment key={item.id}>
              {item.link ? (
                <Link
                  href={item.link!}
                  scroll={false}
                  className={`${styles.sidebar__primaryList__item} ${
                    pathname.startsWith(item.link!) &&
                    styles["sidebar__primaryList__item__active"]
                  }`}
                  style={{ marginBottom: "0.25rem" }}
                  onClick={() => {
                    setSelected("");
                  }}
                >
                  <span className={styles.sidebar__primaryList__item__icon}>
                    {item.icon}
                  </span>
                  <span className={styles.sidebar__primaryList__item__name}>
                    {item.name}
                  </span>
                </Link>
              ) : (
                <a
                  className={`${styles.sidebar__primaryList__item}  ${
                    pathname.split("-").join(" ").split("/")[2] === item.name &&
                    styles["sidebar__primaryList__item__active"]
                  }`}
                  onClick={() => {
                    selected === item.name
                      ? setSelected("")
                      : setSelected(item.name);
                  }}
                >
                  <span className={styles.sidebar__primaryList__item__icon}>
                    {item.icon}
                  </span>
                  <span className={styles.sidebar__primaryList__item__name}>
                    {item.name}
                  </span>
                  <button
                    className={`${styles.sidebar__primaryList__item__svg} `}
                  >
                    <ChevronDown
                      className={selected === item.name ? styles["rotate"] : ""}
                    />
                  </button>
                </a>
              )}
              {item.dropdown && (
                <div
                  className={`${styles.sidebar__dropdown} ${
                    selected === item.name ? styles.show : ""
                  }`}
                >
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      href={dropdownItem.link}
                      key={dropdownItem.id}
                      className={styles.sidebar__dropdown__item}
                    >
                      <span
                        className={`${styles.sidebar__dropdown__name} ${
                          pathname === dropdownItem.link
                            ? styles["sidebar__dropdown__active"]
                            : ""
                        }`}
                      >
                        {dropdownItem.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </aside>
    );
  }
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
