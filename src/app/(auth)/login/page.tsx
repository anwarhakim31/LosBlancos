import AuthLayouts from "@/components/layouts/AuthLayout";
import React, { Fragment } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk Untuk Berbelanja",
  description: "Masuk dengan akun anda untuk berbelanja",
  openGraph: {
    title: "Login",
    description: "Masuk Toko dengan akun anda untuk berbelanja",
    type: "website",
    locale: "id_ID",
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/login`,
  },
};

const LoginPage = () => {
  return (
    <Fragment>
      <AuthLayouts />
    </Fragment>
  );
};

export default LoginPage;
