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
}

const InputSearch = ({ placeholder, id, name, onChange, value }: inputType) => {
  const query = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(query.toString());
      params.set("page", "1");
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, query, pathname, push]);

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
      />
      <SearchIcon />
    </div>
  );
};

export default InputSearch;
