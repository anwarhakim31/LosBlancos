import styles from "./detail.module.scss";
import Cart from "@/assets/cart.svg";
import { Check, Heart, Star } from "lucide-react";
import { formatCurrency } from "@/utils/contant";
import { Fragment, useEffect, useState } from "react";
import { itemCartType, TypeProduct } from "@/services/type.module";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { postWishlist, removeWishlist } from "@/store/slices/wishSlice";
import { postCart } from "@/store/slices/cartSlice";
import QuantityAction from "@/components/element/Quantity";
import { ResponseError } from "@/utils/axios/response-error";
import { transactionService } from "@/services/transaction/method";
import halfstar from "@/assets/halfstar.png";
import Image from "next/image";

const DetailInfoView = ({ product }: { product: TypeProduct }) => {
  const session = useSession();
  const router = useRouter();
  const { wishlist, loading: loadingWishlist } = useAppSelector(
    (state) => state.wishlist
  );

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [selectValue, setSelectValue] = useState("");
  const [alert, setAlert] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleWishlist = () => {
    if (session.status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (wishlist.some((item) => item.product._id === product._id)) {
      dispatch(
        removeWishlist({
          productId: product._id as string,
          userId: session?.data?.user?.id as string,
        })
      );
    } else {
      dispatch(
        postWishlist({
          user: session?.data?.user?.id as string,
          product: product._id as string,
        })
      );
    }
  };

  const handleAddToCart = () => {
    if (session.status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (selectValue === "") {
      return setAlert(true);
    }

    dispatch(
      postCart({
        userId: session.data?.user?.id as string,
        productId: product._id as string,
        quantity: quantity,
        atribute: product.attribute as string,
        atributeValue: selectValue as string,
      })
    );
  };
  const handleCheckout = async () => {
    if (session.status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (selectValue === "") {
      return setAlert(true);
    }

    setIsLoading(false);

    const items = [] as itemCartType[];
    const total = Number(quantity) * (product.price as number);

    items.push({
      product: product,
      quantity: quantity,
      price: (product.price as number) * quantity,
      atribute: product.attribute as string,
      atributeValue: selectValue as string,
    });

    try {
      const res = await transactionService.create(
        session.data?.user?.id as string,
        items,
        total
      );

      if (res.status == 200) {
        router.push("/checkout/" + res.data.id);
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(product);

  useEffect(() => {
    const selectStock = product?.stock?.find(
      (item) => item.value === selectValue
    );

    if (selectStock) {
      if (quantity > selectStock.stock) {
        setQuantity(
          product.stock.find((item) => item.value === selectValue)
            ?.stock as number
        );
      }
    }
  }, [selectValue, quantity, setQuantity, product]);

  return (
    <div className={styles.info}>
      <div className={styles.info__title}>
        <h1>{product?.name}</h1>
        <button
          type="button"
          aria-label="add to wishlist"
          onClick={handleWishlist}
          disabled={loadingWishlist}
        >
          <Heart
            className={
              wishlist.length > 0 &&
              wishlist.some((item) => item?.product._id === product?._id)
                ? styles.wish
                : ""
            }
          />
        </button>
      </div>
      <div className={styles.info__wrapper}>
        <div className={styles.info__rating}>
          {Array.from({ length: 5 }).map((_, index) => {
            const fullStar =
              product?.averageRating && product?.averageRating >= index + 1;
            const halfStar =
              product?.averageRating &&
              product?.averageRating >= index + 0.5 &&
              product?.averageRating < index + 1;

            return (
              <Fragment key={index}>
                {fullStar ? (
                  <Star className={styles.active} />
                ) : halfStar ? (
                  <Image src={halfstar} alt="star" width={15} height={15} />
                ) : (
                  <Star />
                )}
              </Fragment>
            );
          })}
          <p>({product?.averageRating || 0})</p>
        </div>

        <p className={styles.info__penilaian}>
          {product?.reviewCount || 0} Penilai
        </p>
        <p className={styles.info__terbeli}>{product?.sold || 0} Terjual</p>
      </div>
      <h3 className={styles.info__price}>
        {formatCurrency(Number(product?.price))}
      </h3>
      <div className={styles.info__category}>
        {product?.category.map((item, index) => (
          <div className={styles.info__category__badge} key={index}>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className={styles.info__atribut}>
        <h3 className={styles.info__atribut__name}>{product?.attribute}</h3>

        <div className={styles.info__atribut__content}>
          {product?.stock.length > 0 &&
            product?.stock?.map((item, index) => (
              <button
                type="button"
                aria-label={`attribute ${item.value}`}
                key={index}
                onClick={() => {
                  setAlert(false);
                  selectValue === item.value
                    ? setSelectValue("")
                    : setSelectValue(item.value);
                }}
                disabled={item.stock === 0}
                className={
                  selectValue === item.value
                    ? styles.value
                    : alert
                    ? styles.alert
                    : styles.default
                }
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
            : product?.stock.reduce((acc, item) => acc + item.stock, 0)}{" "}
          Barang Tersedia
        </p>
      </div>
      <div className={styles.info__kuantitas}>
        <h3 className={styles.info__kuantitas__name}>Kuantitas</h3>

        <QuantityAction
          quantity={quantity}
          handleMinQuantity={() =>
            quantity === 1 ? setQuantity(1) : setQuantity(quantity - 1)
          }
          handleMaxQuantity={() => {
            if (
              quantity <
              product?.stock.reduce((acc, item) => acc + item.stock, 0)
            ) {
              quantity ===
              product?.stock.find((item) => item.value === selectValue)?.stock
                ? setQuantity(
                    product?.stock.find((item) => item.value === selectValue)
                      ?.stock as number
                  )
                : setQuantity(quantity + 1);
            }
          }}
        />
      </div>
      <div className={styles.info__btn}>
        <button
          type="button"
          aria-label="add to cart"
          className={styles.cart}
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <Cart /> <span>Masukkan Keranjang</span>
        </button>
        <button
          className={styles.buy}
          type="button"
          aria-label="buy now"
          disabled={isLoading}
          onClick={handleCheckout}
        >
          <span>Beli Sekarang</span>
        </button>
      </div>
    </div>
  );
};

export default DetailInfoView;
