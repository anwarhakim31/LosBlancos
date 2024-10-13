"use client";

import React, { FC, Fragment, useEffect, useState } from "react";
import styles from "./header.module.scss";
import { usePathname } from "next/navigation";
import NavbarView from "@/components/views/header/NavMember";
import { TypeCollection } from "@/services/type.module";
import { useAppDispatch } from "@/store/hook";
import { fetchProducts } from "@/store/slices/productSlice";
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
  const dispatch = useAppDispatch();

  const [isActive, setIsActive] = useState(false);
  const [isNonActive, setIsNonActive] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
        <div className={styles.top}></div>
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
