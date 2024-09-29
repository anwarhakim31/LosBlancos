import React from "react";
import styles from "./checkbox.module.scss";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  style?: React.CSSProperties;
}

const Checkbox = ({ checked, onChange, id, style }: CheckboxProps) => {
  return (
    <label htmlFor={id} className={styles.label} style={style}>
      <input
        type="checkbox"
        id={id}
        name="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={onChange}
      />
      <div>
        <Check />
      </div>
    </label>
  );
};

export default Checkbox;
