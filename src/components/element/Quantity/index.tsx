import { Minus, Plus } from "lucide-react";
import styles from "./quantity.module.scss";

const QuantityAction = ({
  quantity,
  handleMinQuantity,
  handleMaxQuantity,
}: {
  quantity: number;
  handleMaxQuantity: () => void;
  handleMinQuantity: () => void;
}) => {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        aria-label="minus"
        className={styles.btn}
        onClick={handleMinQuantity}
      >
        <Minus />
      </button>
      <p className={styles.value}>{quantity}</p>
      <button
        type="button"
        aria-label="plus"
        className={styles.btn}
        onClick={handleMaxQuantity}
      >
        <Plus />
      </button>
    </div>
  );
};

export default QuantityAction;
