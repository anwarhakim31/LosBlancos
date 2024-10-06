/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import styles from "./formcontrol.module.scss";

import SelectOptionFetchSearch from "@/components/element/SelectOptionFetchSearch";

interface InputForm {
  placeholder: string;
  name: string;
  id: string;
  error?: any;
  fetching: () => Promise<any>;
  field: any;
}

const FormControlSelectSearch = ({
  id,
  name,
  placeholder,
  fetching,
  error,
  field,
}: InputForm) => {
  return (
    <Fragment>
      <div className={styles["select-group"]}>
        <label htmlFor={id} className={styles["select-group__label"]}>
          {name}
        </label>
        <SelectOptionFetchSearch
          id={id}
          name={name}
          placeholder={placeholder}
          fetching={fetching}
          field={field}
        />
      </div>

      <p className={styles["error-message"]}>{error[id]?.message}</p>
    </Fragment>
  );
};

export default FormControlSelectSearch;
