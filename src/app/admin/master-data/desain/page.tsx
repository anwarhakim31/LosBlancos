"use client";
import HeaderPage from "@/components/element/HeaderPage";
import styles from "./desain.module.scss";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarousalView from "@/components/views/admin/mater-data/Caraousel";
import MarqueeView from "@/components/views/admin/mater-data/Marquee";

const tabs = ["carousel", "marquee", "galeri"];

const DesainPage = () => {
  const { replace } = useRouter();
  const params = useSearchParams();
  const tabParams = params.get("tab");
  const [selectedTab, setSelectedTab] = useState(tabParams || "carousel");

  useEffect(() => {
    if (!tabs.includes(tabParams || "")) {
      replace("/admin/master-data/desain?tab=carousel");
      setSelectedTab("carousel");
    }
  }, [tabParams, replace]);

  return (
    <section>
      <HeaderPage
        title="Halaman Desain"
        description="Kelola desain toko beruntuk logo, Merek"
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
              replace(`/admin/master-data/desain?tab=${tab}`);
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {selectedTab === "carousel" && <CarousalView />}
      {selectedTab === "marquee" && <MarqueeView />}
    </section>
  );
};

export default DesainPage;
