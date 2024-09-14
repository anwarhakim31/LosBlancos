/* eslint-disable @typescript-eslint/no-explicit-any */
import InputElement from "@/components/element/Input";
import styles from "./inputAuth.module.scss";
import { Fragment } from "react";

const InputAuthFragment = ({
  type,
  placeholder,
  name,
  id,
  field,
  label,
  error,
}: any) => {
  return (
    <Fragment>
      <div className={styles["input-group"]}>
        <InputElement
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          field={field}
        />
        {label && (
          <label htmlFor={id} className={styles["label-input"]}>
            {name}
          </label>
        )}
      </div>

      <p className={styles["error-message"]}>
        {error[name] && error[name].message && error[name].message}
      </p>
    </Fragment>
  );
};

export default InputAuthFragment;
