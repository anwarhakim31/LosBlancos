/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import styles from "./input.module.scss";

interface propsType {
  id: string;
  field: any;
}

const InputWeight = ({ id, field }: propsType) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (field.value !== "" && value === "") {
      const number = parseInt(field.value);
      setValue(number.toString());
    }
  }, [field, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    setValue(rawValue);
    field.onChange(rawValue.replace(/\D/g, ""));
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.info}>Gram</p>
      <input
        type="text"
        name={id}
        id={id}
        className={styles.input}
        placeholder="0"
        value={value}
        onChange={handleChange}
        onBlur={field.onBlur}
        autoComplete="off"
      />
    </div>
  );
};

export default InputWeight;
