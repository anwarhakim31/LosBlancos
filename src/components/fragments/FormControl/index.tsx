/* eslint-disable @typescript-eslint/no-explicit-any */
import InputAuth from "@/components/element/Input";
import styles from "./formcontrol.module.scss";
import { Fragment } from "react";

interface InputForm {
  type: string;
  placeholder: string;
  name: string;
  id: string;
  field: any;
  error?: any;
}

const FormControlFragment = ({
  type,
  placeholder,
  name,
  id,
  field,
  error,
}: InputForm) => {
  return (
    <Fragment>
      <div className={styles["input-group"]}>
        <label htmlFor={id}>{name}</label>
        <InputAuth
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          field={field}
        />
      </div>
      <p className={styles["error-message"]}>
        {error[id] && error[id]?.message && error[id].message}
      </p>
    </Fragment>
  );
};

export default FormControlFragment;
