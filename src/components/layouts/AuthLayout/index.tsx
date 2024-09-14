"use client";

import Link from "next/link";
import styles from "./auths.module.scss";
import { usePathname } from "next/navigation";

const AuthLayouts = () => {
  const pathname = usePathname();

  return (
    <main className={styles.auth}>
      <div className={styles.auth__form}>
        <h3 className={styles.auth__form__title}>Register</h3>

        <form></form>

        <p className={styles.auth__form__link}>
          {pathname === "/register" ? (
            <>
              Belum memiliki akun? <Link href="/login">Login</Link>
            </>
          ) : pathname === "/login" ? (
            <>
              Sudah memiliki akun? <Link href="/register">Register</Link>
            </>
          ) : (
            <>
              Ingat Password? <Link href="/login">Login</Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
};

export default AuthLayouts;
