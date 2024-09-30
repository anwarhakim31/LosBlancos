"use client";

import React, { ForwardedRef, forwardRef, Fragment, useState } from "react";
import styles from "./sidebar.module.scss";
import Image from "next/image";
import Link from "next/link";
import {
  BoxesIcon,
  ChevronDown,
  LayoutDashboard,
  Package,
  Settings,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

const sideList = [
  {
    id: 1,
    name: "dashboard",
    icon: <LayoutDashboard width={20} height={20} strokeWidth={1.5} />,
    link: "/admin/dashboard",
  },
  {
    id: 2,
    name: "masted data",
    icon: <Settings width={20} height={20} strokeWidth={1.5} />,
    link: "/admin/master-data",
  },
  {
    id: 3,
    name: "user",
    icon: <User width={20} height={20} strokeWidth={1.5} />,
    dropdown: [
      {
        id: 1,
        name: "Kelola User",
        link: "/admin/user/kelola-user",
      },
      {
        id: 2,
        name: "Alamat User",
        link: "/admin/user/alamat-user",
      },
    ],
  },
  {
    id: 4,
    name: "kategori",
    icon: <BoxesIcon width={20} height={20} strokeWidth={1} />,
    link: "/admin/category",
  },
  {
    id: 5,
    name: "produk",
    icon: <Package width={20} height={20} strokeWidth={1.2} />,
    link: "/admin/product",
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ isSidebarOpen }: SidebarProps, ref: ForwardedRef<HTMLDivElement>) => {
    const pathname = usePathname();
    const [selected, setSelected] = useState(pathname.split("/")[2]);

    console.log(selected);

    return (
      <aside
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles["sidebar__active"] : ""
        }`}
        ref={ref}
      >
        <div className={styles.sidebar__logo}>
          <Image src={"/logo.svg"} alt="logo" width={70} height={70} priority />
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
                    pathname.includes(item.name.toLowerCase()) &&
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
