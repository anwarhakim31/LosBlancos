"use client";

import React, { Fragment } from "react";
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
  const pathname = usePathname();

  return (
    <Fragment>
      {!authRender.includes(pathname) && <div className={styles.top}></div>}
      <header className={styles.header}>
        {authRender.includes(pathname) && <NavAuthView />}
      </header>
    </Fragment>
  );
};

export default Header;
