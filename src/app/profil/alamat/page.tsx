"use client";
import { Trash } from "lucide-react";
import styles from "./address.module.scss";
import { useEffect, useState } from "react";
import { TypeShippingAddress } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { addressService } from "@/services/address/methods";
import { useSession } from "next-auth/react";
import ButtonClick from "@/components/element/ButtonClick";
import ModalAddAddress from "@/components/fragments/ModalAddAddress";
import Image from "next/image";
import ModalDeleteAddress from "@/components/fragments/ModalDeleteAddress";

const MyAddressPage = () => {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<TypeShippingAddress[]>([]);
  const [isAdd, setIsAdd] = useState(false);
  const [isDelete, setIsDelete] = useState<null | TypeShippingAddress>(null);

  useEffect(() => {
    const getAddress = async () => {
      setLoading(true);
      try {
        const res = await addressService.get(session?.data?.user?.id as string);
        if (res.status === 200) {
          setAddress(res.data.address);
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.data?.user?.id) {
      getAddress();
    }
  }, [session.data?.user?.id]);

  return (
    <div className={styles.content}>
      <h3>Alamat</h3>
      <p>Atur alamat sebagai tujuan pengiriman pesanan</p>

      <div
        style={{
          width: "150px",
          marginLeft: "auto",
          opacity: address.length > 3 ? 0 : 1,
          pointerEvents: address.length > 3 ? "none" : "auto",
          marginTop: "16px",
        }}
      >
        <ButtonClick
          title="Tambah Alamat"
          loading={loading}
          onClick={() => setIsAdd(true)}
        />
      </div>
      {loading ? (
        <div className={styles.skeleton_list}></div>
      ) : (
        <div className={styles.wrapper}>
          {address.length > 0 ? (
            address.map((item, index) => (
              <div key={index} className={styles.list}>
                <div className={styles.list__contact}>
                  <h4>{item?.fullname}</h4>
                  <small className={styles.gap}>|</small>
                  <p className={styles.list__contact__phone}>{item?.phone}</p>
                </div>
                <p className={styles.list__detail}>{item?.address}</p>
                <div className={styles.list__address}>
                  <p>{item.subdistrict},</p>
                  <p>{item.city.name},</p>
                  <p>{item.province.name},</p>
                  <p>ID</p>
                  <p>{item.postalCode}</p>
                </div>
                <button
                  type="button"
                  aria-label="Delete Address"
                  title="Hapus Alamat"
                  onClick={() => setIsDelete(item)}
                >
                  <Trash />
                </button>
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              <Image
                src={"/no-location.png"}
                alt="empty"
                width={100}
                height={100}
              />
              <p>Anda belum memiliki alamat</p>
            </div>
          )}
        </div>
      )}
      {isAdd && (
        <ModalAddAddress
          onClose={() => setIsAdd(false)}
          setAddress={setAddress}
        />
      )}
      {isDelete && (
        <ModalDeleteAddress
          onClose={() => setIsDelete(null)}
          data={isDelete}
          setAddress={setAddress}
        />
      )}
    </div>
  );
};

export default MyAddressPage;
