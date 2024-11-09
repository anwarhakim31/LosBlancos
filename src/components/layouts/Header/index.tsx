"use client";

import React, { FC, Fragment, useEffect, useState } from "react";
import styles from "./header.module.scss";
import { usePathname } from "next/navigation";
import NavbarView from "@/components/views/header/NavMember";
import { TypeCollection } from "@/services/type.module";
import { useMasterContext } from "@/context/MasterContext";
import { Phone, Send, Ticket } from "lucide-react";

export const authRender = [
  "/register",
  "/login",
  "/forget-password",
  "/reset-password",
];

interface propsType {
  collection: TypeCollection[];
}

const Header: FC<propsType> = ({ collection }) => {
  const pathname = usePathname();
  const context = useMasterContext();

  const [isActive, setIsActive] = useState(false);
  const [isNonActive, setIsNonActive] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 400) {
        setIsActive(true);
        setIsNonActive(false);
      }

      if (currentScrollY < 400 && currentScrollY < lastScrollY) {
        setIsActive(false);
        setIsNonActive(true);
      }

      if (currentScrollY < 200 && currentScrollY < lastScrollY) {
        setIsActive(false);
        setIsNonActive(false);
      }

      lastScrollY = currentScrollY;
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Fragment>
      {!authRender.includes(pathname) && !pathname.startsWith("/admin") && (
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.top__list}>
              <Phone width={12} height={12} strokeWidth={1.5} />
              <p>{`(+62) ${
                context?.master.phone?.startsWith("0")
                  ? context?.master.phone?.slice(1)
                  : context?.master.phone?.startsWith("62")
                  ? context?.master.phone?.slice(2)
                  : context?.master.phone
              }`}</p>
            </div>
            <div className={styles.top__list}>
              <Send width={18} height={18} />
              <p>{`${context?.master.email}`}</p>
            </div>
            <div className={styles.top__list}>
              <Ticket width={18} height={18} />
              <p>Dapatkan Diskon Pertama Anda</p>
            </div>
          </div>
        </div>
      )}
      <header
        className={`${styles.header}  ${isActive ? styles.active : ""} ${
          isNonActive ? styles.nonactive : ""
        }`}
      >
        {!pathname.startsWith("/admin") && (
          <NavbarView collection={collection} />
        )}
      </header>
    </Fragment>
  );
};

export default Header;
