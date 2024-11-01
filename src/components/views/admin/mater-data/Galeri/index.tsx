import { Edit, List } from "lucide-react";
import styles from "./galeri.module.scss";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { masterService } from "@/services/master/method";
import { ResponseError } from "@/utils/axios/response-error";
import ModalEditGaleri from "./ModalEditGaleri";

const GaleriView = () => {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<string[]>([]);
  const [isEditData, setIsEditData] = useState<{
    image: string;
    id: number;
  } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await masterService.getGaleri();

      setData(res.data.galeri.image);
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(data);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__box}>
          <div className={styles.header__title}>
            <List width={22} height={22} />
            <h5>Galeri</h5>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        {loading &&
          Array(6)
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
                <Image
                  src={item}
                  alt="logo"
                  width={500}
                  height={500}
                  priority
                />
              </div>
            </div>
          ))}

        {isEditData && (
          <ModalEditGaleri
            onClose={() => setIsEditData(null)}
            isEditData={isEditData}
            callback={fetchData}
          />
        )}
      </div>
    </div>
  );
};

export default GaleriView;
