import SelectOption from "@/components/element/SelectOption";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import style from "./status.module.scss";
import { SlidersHorizontal } from "lucide-react";

const FilterStatus = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const pathname = usePathname();
  const query = useSearchParams();

  const statusPayment = query.get("status-payment") || "semua";
  const statusTransaction = query.get("status-transaction") || "semua";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [active]);

  return (
    <div ref={ref} className={style.filter}>
      <button
        type="button"
        aria-label="filter"
        className={style.filter__btn}
        onClick={() => setActive(!active)}
      >
        <span>Filter</span>
        <SlidersHorizontal />
      </button>

      {active && (
        <div role="menu" className={style.filter__dropdown}>
          <div className={style.filter__dropdown__item}>
            <label htmlFor="payment">Status Pembayaran</label>
            <SelectOption
              options={[
                "semua",
                "tertunda",
                "dibayar",
                "dibatalkan",
                "ditolak",
              ]}
              id="status"
              name="status"
              placeholder="Status Pembayaran"
              field={{
                value: statusTransaction,
                onChange: (value: string) => {
                  const searchParam = new URLSearchParams(query.toString());

                  if (value === "semua") {
                    searchParam.delete("status-transaction");
                  } else {
                    searchParam.set("status-payment", value);
                  }

                  router.replace(`${pathname}?${searchParam.toString()}`);
                },
              }}
            />
          </div>
          <div className={style.filter__dropdown__item}>
            <label htmlFor="transaction">Status Transaksi</label>
            <SelectOption
              options={[
                "semua",
                "tertunda",
                "diproses",
                "dikirim",
                "selesai",
                "dibatalkan",
              ]}
              id="transaction"
              name="transaction"
              placeholder="Status Transaksi"
              field={{
                value: statusPayment,
                onChange: (value: string) => {
                  const searchParam = new URLSearchParams(query.toString());

                  if (value === "semua") {
                    searchParam.delete("status-payment");
                  } else {
                    searchParam.set("status-transaction", value);
                  }

                  router.replace(`${pathname}?${searchParam.toString()}`);
                },
              }}
              error={{ status: false, message: "" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterStatus;
