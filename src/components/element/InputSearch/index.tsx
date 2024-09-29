/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import styles from "./input.module.scss";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

interface inputType {
  placeholder: string;
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  loading?: boolean;
}

const InputSearch = ({
  placeholder,
  id,
  name,
  onChange,
  value,
  loading,
}: inputType) => {
  const query = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(query.toString());

  const updateParams = (params: URLSearchParams, value: string) => {
    if (value) {
      params.set("page", "1");
      params.set("search", value);
    } else {
      params.delete("search");
    }

    return params.toString();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const updatedParams = updateParams(params, value);
      push(`${pathname}?${updatedParams}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className={styles.wrapper}>
      <input
        type="search"
        id={id}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className={styles.input}
        disabled={loading}
      />
      <SearchIcon />
    </div>
  );
};

export default InputSearch;
