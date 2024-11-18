/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import styles from "./formcontrolprofile.module.scss";

interface InputForm {
  type: string;
  placeholder: string;
  name: string;
  id: string;
  field: any;
  errors: any;
  isEdit: boolean;
}

const FormControlProfile = ({
  field,
  isEdit,
  name,
  type,
  id,
  placeholder,
  errors,
}: InputForm) => {
  return (
    <Fragment>
      <label htmlFor={id} className={styles.label}>
        {name}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`${styles.input} ${
          isEdit ? styles.input__active : styles.input__disabled
        }`}
        {...field}
        disabled={!isEdit}
      />
      <p className={styles.error}>
        {errors[id] && errors[id]?.message && errors[id].message}
      </p>
    </Fragment>
  );
};

export default FormControlProfile;
