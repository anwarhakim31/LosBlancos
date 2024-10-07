/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./input.module.scss";

interface propsType {
  id: string;
  field: any;
}

const InputCurrency = ({ id, field }: propsType) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.info}>IDR</p>
      <input
        type="number"
        id={id}
        className={styles.input}
        placeholder="0"
        min={0}
        {...field}
      />
    </div>
  );
};

export default InputCurrency;
