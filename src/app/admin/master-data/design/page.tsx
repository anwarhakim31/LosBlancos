"use client";
import HeaderPage from "@/components/element/HeaderPage";
import styles from "./desain.module.scss";
import { Fragment, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarousalView from "@/components/views/admin/mater-data/Caraousel";
import MarqueeView from "@/components/views/admin/mater-data/Marquee";
import GaleriView from "@/components/views/admin/mater-data/Galeri";
import BannerView from "@/components/views/admin/mater-data/Banner";

const tabs = ["carousel", "marquee", "galeri", "banner"];

const DesainPage = () => {
  const { replace } = useRouter();
  const params = useSearchParams();
  const tabParams = params.get("tab");
  const [selectedTab, setSelectedTab] = useState(tabParams || "carousel");

  useEffect(() => {
    if (!tabs.includes(tabParams || "")) {
      replace("/admin/master-data/design?tab=carousel");
      setSelectedTab("carousel");
    }
  }, [tabParams, replace]);

  return (
    <Fragment>
      <HeaderPage
        title="Halaman Master Beranda"
        description="Kelola desain toko yang digunakan pada halaman beranda"
      />
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`${styles.tab} ${
              selectedTab === tab && styles.active__tab
            } `}
            onClick={() => {
              setSelectedTab(tab);
              replace(`/admin/master-data/design?tab=${tab}`);
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {selectedTab === "carousel" && <CarousalView />}
      {selectedTab === "marquee" && <MarqueeView />}
      {selectedTab === "galeri" && <GaleriView />}
      {selectedTab === "banner" && <BannerView />}
    </Fragment>
  );
};

export default DesainPage;
