import SelectOption from "@/components/element/SelectOption";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import style from "./status.module.scss";
import { CalendarClock } from "lucide-react";

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

  console.log(active);

  return (
    <div ref={ref} className={style.filter}>
      <button
        type="button"
        aria-label="filter"
        className={style.filter__btn}
        onClick={() => setActive(!active)}
        title="Filter"
      >
        <CalendarClock />
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
              style={{ minHeight: "100px" }}
              field={{
                value: statusPayment,
                onChange: (value: string) => {
                  const searchParam = new URLSearchParams(query.toString());

                  if (value === "semua") {
                    searchParam.delete("status-payment");
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
              style={{ minHeight: "100px" }}
              field={{
                value: statusTransaction,
                onChange: (value: string) => {
                  const searchParam = new URLSearchParams(query.toString());

                  if (value === "semua") {
                    searchParam.delete("status-transaction");
                  } else {
                    searchParam.set("status-transaction", value);
                  }

                  router.replace(`${pathname}?${searchParam.toString()}`);
                },
              }}
            />
          </div>
          <div className={style.filter__dropdown__item}>
            <label htmlFor="payment">Tanggal</label>
            <SelectOption
              options={[
                "semua",
                "ini hari",
                "3 hari terakhir",
                "7 hari terakhir",
                "14 hari terakhir",
                "30 hari terakhir",
              ]}
              id="Date"
              name="Date"
              placeholder="Tanggal"
              style={{ minHeight: "100px" }}
              field={{
                value: query.get("date") || "semua",
                onChange: (value: string) => {
                  const searchParam = new URLSearchParams(query.toString());

                  if (value === "semua") {
                    searchParam.delete("date");
                  } else {
                    searchParam.set("date", value);
                  }

                  router.replace(`${pathname}?${searchParam.toString()}`);
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterStatus;
