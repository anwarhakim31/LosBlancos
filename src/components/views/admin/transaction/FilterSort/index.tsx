import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import style from "./status.module.scss";
import { ArrowUpDown } from "lucide-react";
import Checkbox from "@/components/element/Checkbox";

const FilterSort = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const pathname = usePathname();
  const query = useSearchParams();

  const sort = query.get("sort");

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
        aria-label="sort"
        className={style.filter__btn}
        onClick={() => setActive(!active)}
        title="sprt"
      >
        <ArrowUpDown />
      </button>

      {active && (
        <div role="menu" className={style.filter__dropdown}>
          <div className={style.filter__dropdown__item}>
            <Checkbox
              checked={sort === "total-asc"}
              onChange={() => {
                const params = new URLSearchParams(query.toString());

                if (sort === "total-asc") {
                  params.delete("sort");
                } else {
                  params.set("sort", "total-asc");
                }
                router.replace(`${pathname}?${params.toString()}`);
              }}
              id="total-asc"
            />
            <label htmlFor="total-asc">Total Tertinggi</label>
          </div>
          <div className={style.filter__dropdown__item}>
            <Checkbox
              checked={sort === "total-desc"}
              onChange={() => {
                const params = new URLSearchParams(query.toString());

                if (sort === "total-desc") {
                  params.delete("sort");
                } else {
                  params.set("sort", "total-desc");
                }
                router.replace(`${pathname}?${params.toString()}`);
              }}
              id="total-desc"
            />
            <label htmlFor="total-desc">Total Terendah</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSort;
