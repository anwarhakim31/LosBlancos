"use client";

import React, { Fragment, useEffect, useState } from "react";
import styles from "./header.module.scss";
import { usePathname } from "next/navigation";
import NavAuthView from "@/components/views/header/NavAuth";

const authRender = [
  "/register",
  "/login",
  "/forget-password",
  "/reset-password",
];
const Header = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const pathname = usePathname();

  const handleScrolls = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    handleScrolls();

    window.addEventListener("scroll", handleScrolls);

    return () => {
      window.removeEventListener("scroll", handleScrolls);
    };
  }, []);

  return (
    <Fragment>
      {!authRender.includes(pathname) && <div className={styles.top}></div>}
      <header
        className={`${styles.header} ${
          scrollY > 300 ? styles.active : styles.nonactive
        } `}
      >
        {authRender.includes(pathname) && <NavAuthView />}
      </header>
    </Fragment>
  );
};

export default Header;
