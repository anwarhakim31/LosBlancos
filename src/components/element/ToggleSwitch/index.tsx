import { FC } from "react";
import styles from "./toggle.module.scss";

interface PropsType {
  checked: boolean;
  handleCheck: () => void;
}

const ToggleSwitch: FC<PropsType> = ({ checked, handleCheck }) => {
  return (
    <label
      htmlFor="toggle"
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
      />
    </label>
  );
};

export default ToggleSwitch;
