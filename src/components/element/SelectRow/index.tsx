import { useEffect, useRef, useState } from "react";
import style from "./select.module.scss";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const row = [8, 16, 24];

const SelectRow = ({ limit }: { limit: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setIsActive] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const value = searchParams.get("limit") || limit.toString();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [active]);

  return (
    <div className={style.select} ref={ref}>
      <button
        type="button"
        className={style.select__button}
        onClick={() => setIsActive(!active)}
      >
        <p>List baris</p>
        <span>{value}</span>
        <ChevronDown className={active ? style.icon_active : ""} />
      </button>
      {active && (
        <div role="data-dropdown" className={style.select__dropdown}>
          {row.map((item) => (
            <div
              tabIndex={0}
              key={item}
              className={limit === item ? style.active : ""}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", "1");
                params.set("limit", String(item));

                replace(`${pathname}?${params.toString()}`, { scroll: false });
                setIsActive(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectRow;
