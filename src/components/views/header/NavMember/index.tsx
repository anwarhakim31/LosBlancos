import React, { useEffect, useRef } from "react";
import styles from "./navbar.module.scss";
import Link from "next/link";
import { FaPhone } from "react-icons/fa";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { authRender } from "@/components/layouts/Header";
import UserMenu from "./UserMenu";
import HomeMenu from "./HomeMenu";

import { MdClose, MdMenu } from "react-icons/md";

const NavbarView = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isActive, setIsActive] = React.useState<boolean>(false);

  const handleHelp = () => {
    const message = `Halo admin, saya butuh bantuan.`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/6281310635243?text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current && navRef.current.parentElement) {
        const parentElement = navRef.current.parentElement;
        console.log(parentElement.classList.contains("header_active__xXEJC"));

        const hasActiveClass = parentElement.classList.contains(
          "header_active__xXEJC"
        );

        if (!hasActiveClass) {
          setIsActive(false);
        }
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isActive, navRef]);

  useEffect(() => {
    if (navRef.current && navRef.current.parentElement && isActive) {
      navRef.current?.parentElement.classList.add(styles["boxshadow"]);
    } else if (navRef.current && navRef.current.parentElement && !isActive) {
      navRef.current?.parentElement.classList.remove(styles["boxshadow"]);
    }
  }, [isActive, navRef]);

  return (
    <nav ref={navRef} className={styles.nav}>
      <div>
        <Link href={"/"} className={styles["nav__logo"]}>
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
            priority
          />
          {/* <span className={styles["nav__logo__text"]}>LosBlancos</span> */}
        </Link>
      </div>

      {!authRender.includes(pathname) && (
        <>
          <div className={styles["nav__menu"]}>
            <HomeMenu />
          </div>
          <UserMenu />
        </>
      )}

      {authRender.includes(pathname) && (
        <div className={styles["nav__help"]}>
          <p>butuh bantuan?</p>
          <button className={styles["nav__help__btn"]} onClick={handleHelp}>
            <FaPhone />
          </button>
        </div>
      )}
      {!authRender.includes(pathname) && (
        <button
          className={styles.nav__burger}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? <MdClose /> : <MdMenu />}
        </button>
      )}

      <div
        className={`${styles.nav__menu__mobile} ${
          isActive ? styles.nav__menu__mobile__active : ""
        }`}
      >
        <div className={styles.nav__menu__mobile__wrapper}>
          {!authRender.includes(pathname) && <HomeMenu />}
        </div>
      </div>
    </nav>
  );
};

export default NavbarView;
