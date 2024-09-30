/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import styles from "./formcontrol.module.scss";
import SelectOption from "@/components/element/SelectOption";

interface InputForm {
  placeholder: string;
  name: string;
  id: string;
  field: any;
  error?: any;
  options?: string[];
}

const FormControlSelect = ({
  id,
  name,
  placeholder,
  field,
  error,
  options,
}: InputForm) => {
  return (
    <Fragment>
      <div className={styles["select-group"]}>
        <label htmlFor={id} className={styles["select-group__label"]}>
          {name}
        </label>
        <SelectOption
          id={id}
          name={name}
          placeholder={placeholder}
          field={field}
          options={options}
        />
      </div>

      <p className={styles["error-message"]}>{error[id]?.message}</p>
    </Fragment>
  );
};

export default FormControlSelect;
