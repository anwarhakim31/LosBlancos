import React from "react";
import styles from "./navauth.module.scss";
import Link from "next/link";
import { FaPhone } from "react-icons/fa";

import Image from "next/image";

const NavAuthView = () => {
  const handleHelp = () => {
    const message = `Halo admin, saya butuh bantuan.`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/6281310635243?text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  return (
    <nav className={styles.nav}>
      <div>
        <Link href={"/"} className={styles["nav__logo"]}>
          <Image
            src={"/losblancos.svg"}
            alt="logo"
            width={80}
            height={80}
            style={{ objectFit: "contain" }}
            priority
          />
          {/* <span className={styles["nav__logo__text"]}>LosBlancos</span> */}
        </Link>
      </div>
      <div className={styles["nav__help"]}>
        <p>butuh bantuan?</p>
        <button className={styles["nav__help__btn"]} onClick={handleHelp}>
          <FaPhone />
        </button>
      </div>
    </nav>
  );
};

export default NavAuthView;
