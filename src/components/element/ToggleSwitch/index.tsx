import { FC } from "react";
import styles from "./toggle.module.scss";

interface PropsType {
  checked: boolean;
  handleCheck: () => void;
  loading?: boolean;
}

const ToggleSwitch: FC<PropsType> = ({ checked, handleCheck, loading }) => {
  return (
    <label
      htmlFor="toggle"
      aria-disabled={loading}
      className={`${styles.track} ${checked ? styles.track__active : ""}`}
    >
      <div
        className={`${styles.dot} ${checked ? styles.dot__active : ""}`}
      ></div>
      <input
        type="checkbox"
        id="toggle"
        checked={checked}
        onChange={handleCheck}
        name="toggle"
        className={`${styles.toggle} `}
        disabled={loading}
      />
    </label>
  );
};

export default ToggleSwitch;
