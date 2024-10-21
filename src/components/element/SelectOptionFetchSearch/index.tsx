/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseError } from "@/utils/axios/response-error";
import React, { useEffect, useRef, useState } from "react";
import styles from "./select.module.scss";
import { ChevronDown } from "lucide-react";

interface propsType {
  placeholder: string;
  id: string;
  name: string;
  field: any;
  fetching: () => Promise<any>;
  label: string;
}

const SelectOptionFetchSearch = ({
  placeholder,
  id,
  name,
  field,
  fetching,
  label,
}: propsType) => {
  const compRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [select, setSelect] = React.useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetching();

        if (res.status === 200) {
          setData(res.data[name]);
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [name, fetching]);

  useEffect(() => {
    let clone = [...data];
    if (clone.length > 0 && search) {
      clone = clone.filter((item: any) => {
        return item[name].toLowerCase().includes(search.toLowerCase());
      });
    }
    if (clone.length === 0) {
      setSelect("");
    }

    return setDataSearch(clone);
  }, [data, search, name]);

  const handleSelect = (value: any) => {
    setSelect(value[name] || "");
    field?.onChange(value || { id: "" });
    setOpen(false);
    setSearch("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (compRef.current && !compRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    setSelect(field?.value?.[name] || "");
  }, [field, name]);

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
          <input
            type="text"
            name="search"
            id="search"
            placeholder={`Cari ${label}`}
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
          />
          <span
            onClick={() => handleSelect("")}
            onKeyDown={() => handleSelect("")}
          >
            {placeholder}
          </span>
          {dataSearch?.length > 0 &&
            dataSearch.map((item: any, i: number) => {
              return (
                <span
                  key={i + 1}
                  tabIndex={0}
                  onClick={() => handleSelect(item)}
                  onKeyDown={() => handleSelect(item)}
                  style={{
                    color: field.value === item[name] ? "blue" : "black",
                  }}
                >
                  {item[name]}
                </span>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SelectOptionFetchSearch;
