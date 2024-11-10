import HeaderPage from "@/components/element/HeaderPage";

import LogoView from "@/components/views/admin/mater-data/Logo";

import React, { Fragment } from "react";
import InfoView from "@/components/views/admin/mater-data/Info";

const TokoPage = () => {
  return (
    <Fragment>
      <HeaderPage
        title="Halaman Master Toko"
        description="Kelola Logo & Informasi Toko"
      />
      <LogoView />
      <InfoView />
    </Fragment>
  );
};

export default TokoPage;
