/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import styles from "./input.module.scss";

interface propsType {
  id: string;
  field: any;
}

const InputCurrency = ({ id, field }: propsType) => {
  const [value, setValue] = useState<string>("");

  const formatCurrency = (value: string) => {
    const number = parseInt(value.replace(/\D/g, ""), 10);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("id-ID").format(number);
  };

  useEffect(() => {
    if (field.value !== "" && value === "") {
      console.log(value);
      const number = parseInt(field.value);
      setValue(new Intl.NumberFormat("id-ID").format(number));
    }
  }, [field, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    setValue(formattedValue);
    field.onChange(rawValue.replace(/\D/g, ""));
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.info}>IDR</p>
      <input
        type="text"
        name={id}
        id={id}
        className={styles.input}
        placeholder="0"
        value={value}
        onChange={handleChange}
        onBlur={field.onBlur}
      />
    </div>
  );
};

export default InputCurrency;
