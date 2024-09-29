import { X } from "lucide-react";
import styles from "./index.module.scss";
import { useEffect, useRef } from "react";

const HeaderModal = ({
  onClose,
  title,
}: {
  onClose: () => void;
  title: string;
}) => {
  const buttonRf = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRf.current) {
      buttonRf.current.focus();
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <h3>{title}</h3>
      <button onClick={onClose} ref={buttonRf}>
        <X />
      </button>
    </div>
  );
};

export default HeaderModal;
