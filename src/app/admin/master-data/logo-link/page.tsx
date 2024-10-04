import HeaderPage from "@/components/element/HeaderPage";
import LogoView from "@/components/views/admin/mater-data/Logo";
import React, { Fragment } from "react";

const LogoLinkPage = () => {
  return (
    <Fragment>
      <HeaderPage
        title="Halaman Logo & Link"
        description="Kelola logo & Link toko yang digunakan pada setiap halaman"
      />
      <LogoView />
    </Fragment>
  );
};

export default LogoLinkPage;
