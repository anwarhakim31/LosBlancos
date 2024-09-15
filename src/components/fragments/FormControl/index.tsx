/* eslint-disable @typescript-eslint/no-explicit-any */
import InputElement from "@/components/element/Input";
import styles from "./formcontrol.module.scss";
import { Fragment } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const FormControlFragment = ({
  type,
  placeholder,
  name,
  id,
  field,
  label,
  error,
  handleShowPassword,
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
        {name === "password" && (
          <button
            type="button"
            className={styles["show-password"]}
            onClick={handleShowPassword}
          >
            {type === "password" ? (
              <FaRegEye size={15} />
            ) : (
              <FaRegEyeSlash size={17} />
            )}
          </button>
        )}
      </div>

      <p className={styles["error-message"]}>
        {error[name] && error[name].message && error[name].message}
      </p>
    </Fragment>
  );
};

export default FormControlFragment;
