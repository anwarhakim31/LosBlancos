"use client";

import React, { ForwardedRef, forwardRef, Fragment, useState } from "react";
import styles from "./sidebar.module.scss";
import Image from "next/image";
import Link from "next/link";
import {
  AlignHorizontalSpaceAround,
  ChevronDown,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Layers3,
  LayoutDashboard,
  LibraryBig,
  MonitorCog,
  Package,
  ShoppingBag,
  Star,
  Ticket,
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
        name: "Toko",
        link: "/admin/master-data/store",
      },
      {
        id: 2,
        name: "Desain",
        link: "/admin/master-data/design",
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
  {
    id: 9,
    name: "diskon",
    icon: <Ticket width={20} height={20} strokeWidth={1.2} />,
    link: "/admin/discount",
  },
  {
    id: 10,
    name: "ulasan",
    icon: <Star width={20} height={20} strokeWidth={1.2} />,
    link: "/admin/reviews",
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      isSidebarOpen,
      isMinimized,
      setIsMinimized,
      setIsSidebarOpen,
    }: SidebarProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
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
        style={{
          width: isMinimized ? "85px" : "190px",
        }}
      >
        <div className={styles.sidebar__logo}>
          {context?.master.displayLogo ? (
            <Image
              src={context?.master.logo || "/default.png"}
              alt="logo"
              width={isMinimized ? 50 : 65}
              height={isMinimized ? 50 : 65}
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
              {isMinimized
                ? context?.master.name?.charAt(0)
                : context?.master.displayName}
            </p>
          ) : null}
        </div>
        <div className={styles.sidebar__primaryList}>
          {sideList.map((item) => (
            <Fragment key={item.id}>
              {item.link ? (
                <div
                  className={`${styles.sidebar__primaryList__item} ${
                    pathname.startsWith(item.link!) &&
                    styles["sidebar__primaryList__item__active"]
                  }`}
                  style={{ marginBottom: "0.25rem" }}
                  onClick={() => {
                    setSelected("");
                  }}
                >
                  <Link href={item.link!} scroll={false}>
                    <span className={styles.sidebar__primaryList__item__icon}>
                      {item.icon}
                    </span>
                    <span
                      className={styles.sidebar__primaryList__item__name}
                      style={{ display: isMinimized ? "none" : "block" }}
                    >
                      {item.name}
                    </span>
                  </Link>
                  {isMinimized && (
                    <div
                      className={
                        styles.sidebar__primaryList__item__dropdownhover
                      }
                    >
                      <Link href={item.link!}>
                        <span>{item.name}</span>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`${styles.sidebar__primaryList__item}  ${
                    pathname.split("-").join(" ").split("/")[2] === item.name &&
                    styles["sidebar__primaryList__item__active"]
                  }`}
                  onClick={() => {
                    !isMinimized
                      ? selected === item.name
                        ? setSelected("")
                        : setSelected(item.name)
                      : null;
                  }}
                >
                  <a>
                    <span className={styles.sidebar__primaryList__item__icon}>
                      {item.icon}
                    </span>
                    <span
                      className={styles.sidebar__primaryList__item__name}
                      style={{ display: isMinimized ? "none" : "block" }}
                    >
                      {item.name}
                    </span>
                    <button
                      className={`${styles.sidebar__primaryList__item__svg} `}
                      style={{ display: isMinimized ? "none" : "flex" }}
                    >
                      <ChevronDown
                        className={
                          selected === item.name ? styles["rotate"] : ""
                        }
                      />
                    </button>
                  </a>
                  {isMinimized && (
                    <div
                      className={
                        styles.sidebar__primaryList__item__dropdownhover
                      }
                    >
                      <p>{item.name}</p>
                      {item?.dropdown?.map((dropdownItem) => (
                        <Link href={dropdownItem.link} key={dropdownItem.id}>
                          <span
                            className={`${styles.sidebar__dropdown__name} ${
                              pathname === dropdownItem.link
                                ? styles.active
                                : ""
                            }`}
                          >
                            {dropdownItem.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!isMinimized && item.dropdown && (
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
        <button
          type="button"
          className={styles.sidebar__minimize}
          onClick={() => setIsMinimized(!isMinimized)}
          aria-label="expanda sidebar"
        >
          {isMinimized ? <ChevronsRight /> : <ChevronsLeft />}
        </button>

        <button
          type="button"
          className={styles.sidebar__close}
          onClick={() => setIsSidebarOpen(false)}
        >
          <ChevronLeft />
        </button>
      </aside>
    );
  }
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
