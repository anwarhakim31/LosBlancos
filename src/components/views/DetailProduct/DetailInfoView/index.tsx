import styles from "./detail.module.scss";
import Cart from "@/assets/cart.svg";
import { Check, Heart, Minus, Plus, Star } from "lucide-react";
import { formatCurrency } from "@/utils/contant";
import { useState } from "react";
import { TypeProduct } from "@/services/type.module";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addWishList, removeWishList } from "@/store/slices/wishSlice";

const DetailInfoView = ({ product }: { product: TypeProduct }) => {
  const wishlist = useAppSelector((state) => state.wishlist.wishlist);
  const dispatch = useAppDispatch();
  const [selectValue, setSelectValue] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleWishlist = () => {
    if (wishlist.some((item) => item._id === product._id)) {
      dispatch(removeWishList(product._id));
    } else {
      dispatch(addWishList(product));
    }
  };

  return (
    <div className={styles.info}>
      <div className={styles.info__title}>
        <h1>{product.name}</h1>
        <button
          type="button"
          aria-label="add to wishlist"
          onClick={handleWishlist}
        >
          <Heart
            className={
              wishlist.some((item) => item._id === product._id)
                ? styles.wish
                : ""
            }
          />
        </button>
      </div>
      <div className={styles.info__wrapper}>
        <div className={styles.info__rating}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className={styles.info__rating__star} />
          ))}
          <p>({Math.round(5.1)})</p>
        </div>

        <p className={styles.info__penilaian}>2 Penilaian</p>
        <p className={styles.info__terbeli}>2 Terjual</p>
      </div>
      <h3 className={styles.info__price}>
        {formatCurrency(Number(product.price))}
      </h3>
      <div className={styles.info__category}>
        {product.category.map((item, index) => (
          <div className={styles.info__category__badge} key={index}>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className={styles.info__atribut}>
        <h3 className={styles.info__atribut__name}>{product.attribute}</h3>

        <div className={styles.info__atribut__content}>
          {product.stock.length > 0 &&
            product?.stock?.map((item, index) => (
              <button
                type="button"
                aria-label={`attribute ${item.value}`}
                key={index}
                onClick={() =>
                  selectValue === item.value
                    ? setSelectValue("")
                    : setSelectValue(item.value)
                }
                disabled={item.stock === 0}
                className={selectValue === item.value ? styles.value : ""}
              >
                {item.value}
                {selectValue === item.value && (
                  <div className={styles.check}>
                    <Check />
                  </div>
                )}
              </button>
            ))}
        </div>
        <p className={styles.info__atribut__total}>
          {selectValue
            ? product?.stock?.find((item) => item.value === selectValue)?.stock
            : product.stock.reduce((acc, item) => acc + item.stock, 0)}{" "}
          Barang Tersedia
        </p>
      </div>
      <div className={styles.info__kuantitas}>
        <h3 className={styles.info__kuantitas__name}>Kuantitas</h3>

        <div className={styles.info__kuantitas__content}>
          <button
            type="button"
            aria-label="minus"
            className={styles.btn}
            onClick={() => setQuantity((prev) => (prev === 1 ? 1 : prev - 1))}
          >
            <Minus />
          </button>
          <p className={styles.value}>{quantity}</p>
          <button
            type="button"
            aria-label="plus"
            className={styles.btn}
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus />
          </button>
        </div>
      </div>
      <div className={styles.info__btn}>
        <button className={styles.cart}>
          <Cart /> <span>Masukkan Keranjang</span>
        </button>
        <button className={styles.buy}>
          <span>Beli Sekarang</span>
        </button>
      </div>
    </div>
  );
};

export default DetailInfoView;
