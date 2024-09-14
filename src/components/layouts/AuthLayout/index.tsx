"use client";

import Link from "next/link";
import styles from "./auths.module.scss";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import RegisterView from "@/components/views/auth/Register";
import LoginView from "@/components/views/auth/Login";

// const detail = ["/register", "/login"];

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const AuthLayouts = () => {
  const pathname = usePathname();

  return (
    <main className={styles.auth}>
      <div className={styles.auth__form}>
        <div className={styles.auth__form__header}>
          <h3
            className={`${styles.auth__form__header__title} ${poppins.className}`}
          >
            Selamat datang di LosBlancos
          </h3>
          <p className={styles.auth__form__header__link}>
            {pathname === "/register" ? (
              <>
                Sudah punya akun? <Link href="/login">Masuk</Link>
              </>
            ) : pathname === "/login" ? (
              <>
                Belum punya akun? <Link href="/register">Daftar</Link>
              </>
            ) : (
              <>
                Ingat Password? <Link href="/login">Login</Link>
              </>
            )}
          </p>
        </div>
        {pathname === "/register" && <RegisterView />}
        {pathname === "/login" && <LoginView />}
      </div>
    </main>
  );
};

export default AuthLayouts;
