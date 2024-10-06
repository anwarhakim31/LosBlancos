/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseError } from "@/utils/axios/response-error";
import React, { useEffect, useRef, useState } from "react";
import styles from "./select.module.scss";
import { ChevronDown } from "lucide-react";

interface propsType {
  placeholder: string;
  id: string;
  name: string;
  setValue: (value: any) => void;
  fetching: () => Promise<any>;
}

const SelectOptionFetch = ({
  placeholder,
  id,
  setValue,
  fetching,
}: propsType) => {
  const compRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState([]);
  const [select, setSelect] = React.useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetching();

        if (res.status === 200) {
          setData(res.data[id]);
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [fetching, id]);

  const handleSelect = (value: any) => {
    setSelect(value?.name || "");
    setValue(value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (compRef.current && !compRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={compRef} className={styles.container}>
      <input
        type="text"
        id={id}
        readOnly
        value={select}
        placeholder={placeholder}
        disabled={loading}
        className={styles.text}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(!open)}
      />
      <div className={styles.icon}>
        <ChevronDown className={open ? styles.active : ""} />
      </div>
      {open && (
        <div role="dialog" className={styles.dropdown}>
          <span
            tabIndex={0}
            onClick={() => handleSelect("")}
            onKeyDown={() => handleSelect("")}
          >
            {placeholder}
          </span>
          {data?.length > 0 &&
            data.map((item: any) => (
              <span
                key={item._id}
                tabIndex={0}
                onClick={() => handleSelect(item)}
                onKeyDown={() => handleSelect(item)}
              >
                {item.name}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

export default SelectOptionFetch;
