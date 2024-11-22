"use client";

import Link from "next/link";
import styles from "./auths.module.scss";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { Poppins } from "next/font/google";
import RegisterView from "@/components/views/auth/Register";
import LoginView from "@/components/views/auth/Login";
import Image from "next/image";
import { signIn } from "next-auth/react";
import ForgotView from "@/components/views/auth/ForgotPassword";
import { Fragment, useState } from "react";
import ResetPasswordView from "@/components/views/auth/ResetPassword";
import { useMasterContext } from "@/context/MasterContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const googleRender = ["/login", "/register"];

const AuthLayouts = () => {
  const pathname = usePathname();
  const [success, setSuccess] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const session = useMasterContext();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  if (!callbackUrl && pathname === "/reset-password") {
    redirect("/login");
  }

  const renderView = () => {
    switch (pathname) {
      case "/register":
        return <RegisterView />;
      case "/login":
        return <LoginView />;
      case "/forget-password":
        return !success ? <ForgotView setSuccess={setSuccess} /> : null;
      case "/reset-password":
        return !success ? <ResetPasswordView setSuccess={setSuccess} /> : null;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <main className={styles.auth}>
        <div className={styles.auth__form}>
          {success && pathname === "/forget-password" && (
            <div className={styles.auth__form__success}>
              <Image
                src={"/mailer.svg"}
                alt="success"
                width={175}
                height={175}
              />
            </div>
          )}
          {success && pathname === "/reset-password" && (
            <div className={styles.auth__form__check}>
              <Image
                src={"/check.svg"}
                alt="success"
                width={100}
                height={100}
              />
            </div>
          )}
          <div className={styles.auth__form__header}>
            <h3
              style={{ textAlign: success ? "center" : "left" }}
              className={`${styles.auth__form__header__title} ${poppins.className}`}
            >
              Selamat datang di {session?.master?.name}
            </h3>
            <p
              style={{ textAlign: success ? "center" : "left" }}
              className={styles.auth__form__header__link}
            >
              {pathname === "/register" ? (
                <>
                  Sudah punya akun? <Link href="/login">Masuk</Link>
                </>
              ) : pathname === "/login" ? (
                <>
                  Belum punya akun? <Link href="/register">Daftar</Link>
                </>
              ) : pathname === "/forget-password" ? (
                <>
                  {success
                    ? "Kami telah mengirimkan email untuk reset password"
                    : "Masukan alamat email yang telah terdaftar untuk menerima link reset password."}
                </>
              ) : (
                <>
                  {success
                    ? "Coba password baru untuk akun Anda"
                    : "Masukan password baru untuk akun Anda."}
                </>
              )}
            </p>
            {pathname === "/reset-password" && success && (
              <button className={styles.auth__form__header__button}>
                <Link href="/login">Masuk</Link>
              </button>
            )}
          </div>
          {googleRender.includes(pathname) && (
            <div className={styles.auth__form__divider}>
              <button
                className={styles.auth__form__divider__button}
                type="button"
                onClick={() => {
                  signIn("google", { callbackUrl, redirect: false });
                }}
              >
                <Image
                  src="/google.svg"
                  width={20}
                  height={20}
                  alt="google"
                  priority
                />
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
    </Fragment>
  );
};

export default AuthLayouts;
