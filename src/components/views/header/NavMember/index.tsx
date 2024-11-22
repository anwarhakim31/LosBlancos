import React, { FC, Fragment, useEffect, useRef } from "react";
import styles from "./navbar.module.scss";
import Link from "next/link";
import Image from "next/image";

import { authRender } from "@/components/layouts/Header";
import UserMenu from "./UserMenu";
import HomeMenu from "./HomeMenu";
import { Megaphone, Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMasterContext } from "@/context/MasterContext";
import { TypeCollection } from "@/services/type.module";

interface propsType {
  collection: TypeCollection[];
}

const NavbarView: FC<propsType> = ({ collection }) => {
  const context = useMasterContext();
  const navRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [width, setWidth] = React.useState<number>(0);
  const pathname = usePathname();

  const handleHelp = () => {
    const message = `Halo admin, saya butuh bantuan.`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${context?.master.phone}?text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current && navRef.current.parentElement) {
        const parentElement = navRef.current.parentElement;

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

  const handleClick = () => {
    if (!isActive) {
      setTimeout(() => setIsActive(true), 300);
    }

    if (isActive) {
      setTimeout(() => setIsActive(false), 300);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (authRender.includes(pathname)) {
      setIsActive(false);
    }
  }, [pathname]);

  return (
    <Fragment>
      <nav ref={navRef} className={styles.nav}>
        <div>
          <Link href={"/"} className={styles["nav__logo"]}>
            {context?.master.displayLogo && (
              <Image
                src={context?.master?.logo || "/default.png"}
                alt="logo"
                width={50}
                height={50}
                style={{ objectFit: "contain" }}
                priority
              />
            )}

            {context?.master.displayName && (
              <span className={styles["nav__logo__text"]}>LosBlancos</span>
            )}
          </Link>
        </div>

        {!authRender.includes(pathname) && (
          <>
            <div className={styles["nav__menu"]}>
              <HomeMenu collection={collection} />
            </div>
            <UserMenu />
          </>
        )}

        {authRender.includes(pathname) && (
          <div className={styles["nav__help"]}>
            <p>butuh bantuan?</p>
            <button className={styles["nav__help__btn"]} onClick={handleHelp}>
              <Phone />
            </button>
          </div>
        )}
        {!authRender.includes(pathname) && (
          <button className={styles.nav__burger} onClick={handleClick}>
            {isActive ? (
              <X width={20} height={20} />
            ) : (
              <Menu width={20} height={20} />
            )}
          </button>
        )}

        <div
          className={`${styles.nav__menu__mobile} ${
            isActive ? styles.nav__menu__mobile__active : ""
          }`}
        >
          <div className={styles.nav__menu__mobile__wrapper}>
            {!authRender.includes(pathname) && (
              <HomeMenu collection={collection} />
            )}
          </div>
        </div>
      </nav>
      {width <= 768 && isActive && (
        <div className={styles.bottom}>
          <div className={styles.bottom__list}>
            <Megaphone width={18} height={18} />
            <p>Dapatkan Diskon Pertama Anda</p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default NavbarView;
