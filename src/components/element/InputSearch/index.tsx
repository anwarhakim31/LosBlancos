import React from "react";
import styles from "./input.module.scss";
import { SearchIcon } from "lucide-react";

interface inputType {
  placeholder: string;
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const InputSearch = ({ placeholder, id, name, onChange, value }: inputType) => {
  return (
    <div className={styles.wrapper}>
      <input
        type="text"
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
