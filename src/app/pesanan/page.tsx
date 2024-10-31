"use client";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./order.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProfileMainLayout from "@/components/layouts/ProfileMainLayout";
import TertundaView from "@/components/views/profile/TertundaView";

const stat = ["tertunda", "diproses", "dikirim", "selesai", "dibatalkan"];

const OrderPage = () => {
  const status = useSearchParams().get("status");
  const [active, setActive] = useState(status || "tertunda");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ProfileMainLayout>
      <div className={styles.content}>
        <h3>Daftar Pesanan</h3>
        <p>Lihat riwayat pesanan </p>
        <div className={styles.status}>
          <h3>Status</h3> <span>:</span>
          <div className={styles.status__row}>
            {stat.map((item, index) => (
              <button
                key={index}
                className={`${styles.status__row__btn} ${
                  active === item ? styles.active : ""
                }`}
                onClick={() => {
                  router.push(`${pathname}?status=${item}`, { scroll: false });
                  setActive(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.wrapper}>
          {active === "tertunda" && <TertundaView />}
        </div>
      </div>
    </ProfileMainLayout>
  );
};

export default OrderPage;
