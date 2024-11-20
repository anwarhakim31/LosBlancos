import AuthLayouts from "@/components/layouts/AuthLayout";
import { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Dafar Akun Untuk Berbelanja",
  description: "Dafar akun dengan akun anda untuk berbelanja",
  openGraph: {
    title: "Dafar Akun",
    description: "Dafar akun dengan akun anda untuk berbelanja",
    type: "website",
    locale: "id_ID",
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/login`,
  },
};

const RegisterPage = () => {
  return (
    <Fragment>
      <AuthLayouts />
    </Fragment>
  );
};

export default RegisterPage;
