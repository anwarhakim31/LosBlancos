import { List } from "lucide-react";
import styles from "./marquee.module.scss";
import ToggleSwitch from "@/components/element/ToggleSwitch";
import { useState } from "react";

const MarqueeView = () => {
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    const timeout = setTimeout(() => {
      setChecked(!checked);
    }, 500);

    return () => clearTimeout(timeout);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__title}>
          <List width={20} height={20} />
          <h5>List Marquee</h5>
        </div>
        <ToggleSwitch handleCheck={handleCheck} checked={checked} />
      </div>
      <div className={styles.content}>
        <div className={styles.content__box}></div>
      </div>
    </div>
  );
};

export default MarqueeView;
