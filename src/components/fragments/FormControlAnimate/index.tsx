/* eslint-disable @typescript-eslint/no-explicit-any */
import Input from "@/components/element/Input";
import styles from "./formcontrol.module.scss";
import { Fragment } from "react";
import { EyeIcon, EyeOff } from "lucide-react";

interface InputForm {
  type: string;
  placeholder: string;
  name: string;
  id: string;
  field: any;
  label?: boolean;
  error?: any;
  handleShowPassword?: () => void;
}

const showPassword = ["password", "confirmPassword"];

const FormControlAnimate = ({
  type,
  placeholder,
  name,
  id,
  field,
  label,
  error,
  handleShowPassword,
}: InputForm) => {
  return (
    <Fragment>
      <div className={styles["input-group"]}>
        <Input
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          field={field}
        />
        {label && (
          <label htmlFor={id} className={styles["label-input"]}>
            {id}
          </label>
        )}
        {showPassword.includes(name) && (
          <button
            type="button"
            className={styles["show-password"]}
            onClick={handleShowPassword}
            aria-label="toggle visibility"
          >
            {type === "password" ? (
              <EyeOff width={17} height={17} />
            ) : (
              <EyeIcon width={17} height={17} />
            )}
          </button>
        )}
      </div>

      <p data-testid={`error ${name}`} className={styles["error-message"]}>
        {error[name] && error[name]?.message && error[name].message}
      </p>
    </Fragment>
  );
};

export default FormControlAnimate;
