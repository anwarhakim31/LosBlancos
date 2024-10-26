"use client";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./order.module.scss";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileMainLayout from "@/components/layouts/ProfileMainLayout";

import PendingView from "@/components/views/profile/PendingView";
import CancelView from "@/components/views/profile/CancelView";
import ProcessView from "@/components/views/profile/processView";
import SendView from "@/components/views/profile/SendView";
import DoneView from "@/components/views/profile/DoneView";

const stat = ["tertunda", "diproses", "dikirim", "selesai", "dibatalkan"];

const OrderPage = () => {
  const status = useSearchParams().get("status");
  const [active, setActive] = useState(
    !stat.includes(status as string) ? "tertunda" : status || "tertunda"
  );
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status && !stat.includes(status as string)) {
      router.push(`${pathname}?status=tertunda`, { scroll: false });
    }
  }, [status, router, pathname]);

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
          {active === "tertunda" && <PendingView />}
          {active === "dibatalkan" && <CancelView />}
          {active === "diproses" && <ProcessView />}
          {active === "dikirim" && <SendView setActive={setActive} />}
          {active === "selesai" && <DoneView />}
        </div>
      </div>
    </ProfileMainLayout>
  );
};

export default OrderPage;
