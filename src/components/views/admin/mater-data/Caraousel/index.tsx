"use client";
import { Edit, List, Trash2 } from "lucide-react";
import styles from "./caraosel.module.scss";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ResponseError } from "@/utils/axios/response-error";
import { masterService } from "@/services/master/method";
import { TypeCarousel } from "@/services/type.module";
import Image from "next/image";
import ModalOneDelete from "@/components/fragments/ModalOneDelete";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hook";
import { setEditCarousel } from "@/store/slices/actionSlice";

const CarouselView = () => {
  const dispatch = useAppDispatch();
  const { push } = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDelete, setIsDelete] = useState<TypeCarousel | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await masterService.getCarousel();
      console.log(res);
      if (res.status === 200) {
        setData(res.data.carousel);
      }
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
            <List width={20} height={20} />
            <h5>List Carousel</h5>
          </div>
          <button disabled={loading || data.length >= 5}>
            <Link
              href="/admin/master-data/design/carousel"
              className={styles.header__btn}
            >
              Tambah
            </Link>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {loading &&
          [...Array(2)].map((_, i) => (
            <div className={styles.wrapper} key={i}>
              <div className={styles.skeleton}></div>
              <div>
                <div className={styles.skeleton_h5}></div>
                <div className={styles.skeleton_p}></div>
              </div>
            </div>
          ))}
        {data.length > 0 &&
          !loading &&
          data.map((item: TypeCarousel) => (
            <div key={item._id} className={styles.content__list}>
              <div className="flex gap-1">
                <div className={styles.content__list__image}>
                  <Image
                    src={item.image}
                    alt="image"
                    width={1000}
                    height={300}
                    priority
                  />
                </div>
                <div className={styles.content__list__text}>
                  <h5>{item.title}</h5>
                  <p>{item.caption}</p>
                </div>
              </div>
              <div></div>

              <div className={styles.content__list__sd}>
                <div className={styles.content__list__textMobile}>
                  <h5>{item.title}</h5>
                  <p>{item.caption}</p>
                </div>
                <button
                  className={styles.edit}
                  aria-label="edit"
                  onClick={() => {
                    dispatch(setEditCarousel(item));
                    push("/admin/master-data/design/carousel?id=" + item._id);
                  }}
                >
                  <Edit
                    width={20}
                    height={20}
                    strokeWidth={1.5}
                    aria-disabled={loading}
                  />
                </button>
                <button
                  aria-label="delete"
                  className={styles.delete}
                  onClick={() => setIsDelete(item)}
                  disabled={loading || data?.length === 1}
                >
                  <Trash2 width={20} height={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
      </div>
      {isDelete && (
        <ModalOneDelete
          onClose={() => setIsDelete(null)}
          title="Apakah anda yakin ingin menghapus ?"
          fetching={() => masterService.deleteCarousel(isDelete?._id as string)}
          callback={() => fetchData()}
        />
      )}
    </div>
  );
};

export default CarouselView;
