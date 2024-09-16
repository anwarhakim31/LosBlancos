"use client";

import Link from "next/link";
import styles from "./auths.module.scss";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import RegisterView from "@/components/views/auth/Register";
import LoginView from "@/components/views/auth/Login";
import Image from "next/image";
import { signIn } from "next-auth/react";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const AuthLayouts = () => {
  const pathname = usePathname();

  const renderView = () => {
    switch (pathname) {
      case "/register":
        return <RegisterView />;
      case "/login":
        return <LoginView />;
      default:
        return null;
    }
  };

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
        {pathname !== "/forgot-password" && (
          <div className={styles.auth__form__divider}>
            <button
              className={styles.auth__form__divider__button}
              type="button"
              onClick={() =>
                signIn("google", { callbackUrl: "/", redirect: false })
              }
            >
              <Image src="/google.svg" width={20} height={20} alt="google" />
              {pathname === "/register" ? "Daftar" : "Masuk"} dengan Google
            </button>

            <div className={styles.auth__form__divider__or}>
              <div></div>
              <span>or</span>
              <div></div>
            </div>
          </div>
        )}

        {renderView()}
      </div>
    </main>
  );
};

export default AuthLayouts;
