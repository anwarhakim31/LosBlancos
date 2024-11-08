"use client";

import styles from "./info.module.scss";
import { useEffect, useState } from "react";

import { useMasterContext } from "@/context/MasterContext";
import { TypeMaster } from "@/services/type.module";
import { List } from "lucide-react";
import MediaComponentView from "./Media";

const InfoView = () => {
  const context = useMasterContext();

  const [formData, setFormData] = useState<TypeMaster>({
    media: [],
  });

  useEffect(() => {
    if (context?.master) {
      setFormData((prev) => ({
        ...prev,
        media: context?.master?.media,
      }));
    }
  }, [setFormData, context?.master]);

  return (
    <form className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__box}>
          <div className={styles.header__title}>
            <List width={20} height={20} />
            <h5>Informasi</h5>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.content__list}>
          <h5>Media</h5>
          <MediaComponentView formData={formData} setFormData={setFormData} />
        </div>
      </div>
    </form>
  );
};

export default InfoView;
