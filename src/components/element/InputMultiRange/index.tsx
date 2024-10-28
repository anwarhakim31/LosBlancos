import styles from "./input.module.scss";

import { useEffect, useRef, useState } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/utils/contant";
import { useRouter } from "next/navigation";

const InputMultiRange = () => {
  const pathname = usePathname();
  const query = useSearchParams();
  const { push } = useRouter();
  const thumbLeftRef = useRef<HTMLDivElement>(null);
  const thumbRightRef = useRef<HTMLDivElement>(null);
  const inputLeftRef = useRef<HTMLInputElement>(null);
  const inputRightRef = useRef<HTMLInputElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);

  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState(500000);
  const min = 0;
  const max = 500000;

  const newQuery = new URLSearchParams(query.toString());

  const maxQuery = query.get("max");
  const minQuery = query.get("min");

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const rightValue = parseInt(inputRightRef.current?.value || `${max}`);

    const adjustedValue = Math.min(value, rightValue - 1);
    setMinValue(adjustedValue);

    if (adjustedValue === min) {
      newQuery.delete("min");
      if (newQuery.size === 1) newQuery.delete("page");
    } else {
      newQuery.set("page", "1");
      newQuery.set("min", adjustedValue.toString());
    }

    push(`${pathname}?${newQuery.toString()}`, { scroll: false });

    const percent = ((adjustedValue - min) / (max - min)) * 100;
    thumbLeftRef.current!.style.left = `${percent}%`;
    rangeRef.current!.style.left = `${percent}%`;
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const leftValue = parseInt(inputLeftRef.current?.value || `${min}`);

    const adjustedValue = Math.max(value, leftValue + 1);
    setMaxValue(adjustedValue);

    if (adjustedValue === max) {
      newQuery.delete("max");
      if (newQuery.size === 1) newQuery.delete("page");
    } else {
      newQuery.set("page", "1");
      newQuery.set("max", adjustedValue.toString());
    }

    push(`${pathname}?${newQuery.toString()}`, { scroll: false });

    const percent = ((adjustedValue - min) / (max - min)) * 100;
    thumbRightRef.current!.style.right = `${100 - percent}%`;
    rangeRef.current!.style.right = `${100 - percent}%`;
  };

  useEffect(() => {
    const minFromQuery = parseInt(minQuery?.toString() || min.toString());
    const maxFromQuery = parseInt(maxQuery?.toString() || max.toString());

    setMinValue(minFromQuery);
    setMaxValue(maxFromQuery);

    const leftPercent = ((minFromQuery - min) / (max - min)) * 100;
    thumbLeftRef.current!.style.left = `${leftPercent}%`;
    rangeRef.current!.style.left = `${leftPercent}%`;

    const rightPercent = ((maxFromQuery - min) / (max - min)) * 100;
    thumbRightRef.current!.style.right = `${100 - rightPercent}%`;
    rangeRef.current!.style.right = `${100 - rightPercent}%`;
  }, [maxQuery, minQuery]);

  return (
    <div className={styles.slider}>
      <input
        type="range"
        id="min-price"
        name="min-price"
        onChange={handleMinChange}
        className={styles.input_left}
        ref={inputLeftRef}
        onMouseEnter={() => thumbLeftRef.current?.classList.add(styles.hover)}
        onMouseLeave={() =>
          thumbLeftRef.current?.classList.remove(styles.hover)
        }
        onMouseDown={() => thumbLeftRef.current?.classList.add(styles.active)}
        onMouseUp={() => thumbLeftRef.current?.classList.remove(styles.active)}
        min={min}
        max={max}
        step={5000}
        value={minValue}
      />
      <input
        type="range"
        id="max-price"
        name="max-price"
        onChange={handleMaxChange}
        onMouseEnter={() => thumbRightRef.current?.classList.add(styles.hover)}
        onMouseLeave={() =>
          thumbRightRef.current?.classList.remove(styles.hover)
        }
        onMouseDown={() => thumbRightRef.current?.classList.add(styles.active)}
        onMouseUp={() => thumbRightRef.current?.classList.remove(styles.active)}
        className={styles.input_right}
        ref={inputRightRef}
        min={min}
        max={max}
        value={maxValue}
        step={5000}
      />

      <div className={styles.slider__wrapper}>
        <div className={styles.slider__track} />
        <div className={styles.slider__range} ref={rangeRef} />
        <div
          className={`${styles.slider__thumb} ${styles.left}`}
          ref={thumbLeftRef}
        />
        <div
          className={`${styles.slider__thumb} ${styles.right}`}
          ref={thumbRightRef}
        />
      </div>
      <div className={styles.slider__value}>
        <p>{formatCurrency(minValue)}</p>
        <p>{formatCurrency(maxValue)}</p>
      </div>
    </div>
  );
};

export default InputMultiRange;
