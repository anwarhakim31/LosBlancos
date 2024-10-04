import { Edit, List } from "lucide-react";
import styles from "./marquee.module.scss";
import ToggleSwitch from "@/components/element/ToggleSwitch";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { masterService } from "@/services/master/method";
import { ResponseError } from "@/utils/axios/response-error";
import ModalEditMarquee from "./ModalEditMarquee";
import ErrorBadge from "@/components/element/ErrorBadge";

const MarqueeView = () => {
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [isEditData, setIsEditData] = useState<{
    image: string;
    id: number;
  } | null>(null);

  const handleCheck = async () => {
    try {
      const res = await masterService.toggleMarquee(!checked);
      if (res.status === 200) {
        setChecked(!checked);
      }
    } catch (error) {
      ResponseError(error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await masterService.getMarquee();
      setChecked(res.data.marquee.display);
      setData(res.data.marquee.image);
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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__box}>
          <div className={styles.header__title}>
            <List />
            <h5>Marquee</h5>
          </div>
          <ToggleSwitch
            checked={checked}
            handleCheck={handleCheck}
            loading={loading}
          />
        </div>
      </div>
      {!loading && !checked && (
        <div className={styles.info}>
          <ErrorBadge isError={"Marquee Sedang Tidak Aktif"} />
        </div>
      )}
      <div className={styles.content}>
        {loading &&
          Array(4)
            .fill("")
            .map((_, i) => <div key={i + 1} className={styles.skeleton}></div>)}
        {!loading &&
          data.length > 0 &&
          data.map((item, i) => (
            <div className={styles.content__box} key={i}>
              <button
                aria-label="edit"
                onClick={() => setIsEditData({ image: item, id: i })}
              >
                <Edit width={18} height={18} strokeWidth={1.5} />
              </button>
              <div className={styles.logo}>
                <Image src={item} alt="logo" width={70} height={70} priority />
              </div>
            </div>
          ))}
      </div>
      {isEditData && (
        <ModalEditMarquee
          onClose={() => setIsEditData(null)}
          isEditData={isEditData}
          callback={fetchData}
        />
      )}
    </div>
  );
};

export default MarqueeView;
