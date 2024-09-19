/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import styles from "./dropdown.module.scss";

const options = ["Option 1", "Option 2", "Option 3"];

const Dropdown = ({ name, id, field, placeholder, style }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState("");
  const [active, setActive] = useState(false);

  const handleClick = (option: string) => {
    setIsSelected(option);
    setActive(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [active]);

  return (
    <div ref={ref} className={styles.wrapper}>
      <input
        type="text"
        name={name}
        id={id}
        value={isSelected}
        placeholder={placeholder}
        {...field}
        className={`${styles.input} ${active ? styles.active : ""}`}
        autoComplete="off"
        readOnly
        onClick={(e) => {
          e.preventDefault();
          setActive(!active);
        }}
        onKeyDown={(e) => e.key === "Enter" && setActive(!active)}
      />

      {active && (
        <div role="dialog" className={styles.dropdown} style={style}>
          {options.map((option, i) => (
            <p
              key={i}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleClick(option)}
              className={styles.dropdown__item}
              onClick={() => handleClick(option)}
            >
              {option}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
