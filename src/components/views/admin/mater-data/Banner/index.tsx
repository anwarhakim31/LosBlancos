import { Edit, List } from "lucide-react";
import styles from "./banner.module.scss";
import ToggleSwitch from "@/components/element/ToggleSwitch";
import { Fragment, useCallback, useEffect, useState } from "react";

import { masterService } from "@/services/master/method";
import { ResponseError } from "@/utils/axios/response-error";

import ErrorBadge from "@/components/element/ErrorBadge";

import ModalEditBannerDiskon from "./ModalEditBannerDiskon";
import ModalEditBannerProduk from "./ModalEditBannerProduk";

const BannerView = () => {
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [isEditData, setIsEditData] = useState<string | null>(null);

  const handleCheck = async () => {
    try {
      const res = await masterService.toogleBanner(!checked);
      if (res.status === 200) {
        setChecked(!checked);
      }
    } catch (error) {
      ResponseError(error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await masterService.getBanner();
      setChecked(res.data.banner.display);
      setData(res.data.banner.image);
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.header__box}>
            <div className={styles.header__title}>
              <List width={22} height={22} />
              <h5>Diskon</h5>
            </div>
            <ToggleSwitch
              id="display_banner"
              checked={checked}
              handleCheck={handleCheck}
              loading={loading}
            />
          </div>
        </div>

        {!loading && !checked && (
          <div className={styles.info}>
            <ErrorBadge isError={"Banner Diskon Sedang Tidak Aktif"} />
          </div>
        )}
        <div className={styles.content}>
          {loading && <div className={styles.skeleton}></div>}
          {!loading && data && (
            <div
              className={styles.content__box}
              style={{ backgroundImage: `url(${data})` }}
            >
              <button aria-label="edit" onClick={() => setIsEditData(data)}>
                <Edit width={18} height={18} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
        {isEditData && (
          <ModalEditBannerDiskon
            onClose={() => setIsEditData(null)}
            isEditData={isEditData}
            callback={fetchData}
          />
        )}
      </div>
      <div className={styles.container} style={{ marginTop: "2rem" }}>
        <div className={styles.header}>
          <div className={styles.header__box}>
            <div className={styles.header__title}>
              <List width={22} height={22} />
              <h5>Produk</h5>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {loading && <div className={styles.skeleton}></div>}
          {!loading && data && (
            <div
              className={styles.content__box}
              style={{ backgroundImage: `url(${data})` }}
            >
              <button aria-label="edit" onClick={() => setIsEditData(data)}>
                <Edit width={18} height={18} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
        {isEditData && (
          <ModalEditBannerProduk
            onClose={() => setIsEditData(null)}
            isEditData={isEditData}
            callback={fetchData}
          />
        )}
      </div>
    </Fragment>
  );
};

export default BannerView;
