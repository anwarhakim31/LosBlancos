import { X } from "lucide-react";
import styles from "./index.module.scss";

const HeaderModal = ({
  onClose,
  title,
}: {
  onClose: () => void;
  title: string;
}) => {
  return (
    <div className={styles.wrapper}>
      <h3>{title}</h3>
      <button onClick={onClose}>
        <X />
      </button>
    </div>
  );
};

export default HeaderModal;
