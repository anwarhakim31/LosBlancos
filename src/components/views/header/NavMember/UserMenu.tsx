import { useSession } from "next-auth/react";

import styles from "./usermenu.module.scss";
import Link from "next/link";
import Cart from "@/assets/cart.svg";
import Image from "next/image";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hook";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWishList } from "@/store/slices/wishSlice";

const UserMenu = () => {
  const dispatch = useDispatch();
  const wishList = useAppSelector((state) => state.wishlist.wishlist);
  const product = useAppSelector((state) => state.product.products);
  const session = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const updateWishList = wishList.filter((list) => {
      return product.some((product) => product._id === list._id);
    });

    if (
      wishList.length > 0 &&
      product.length > 0 &&
      wishList.length !== updateWishList.length
    ) {
      dispatch(setWishList(updateWishList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishList, product]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__user}>
        <Link
          href={"/wishlist"}
          className={styles.wrapper__user__wishlist}
          style={{ color: pathname !== "/" ? "black" : "" }}
        >
          <Heart width={20} height={20} strokeWidth={1.5} />
          {wishList.length > 0 && (
            <div className={styles.wrapper__user__dot}></div>
          )}
        </Link>

        <Link
          href={"/cart"}
          className={styles.wrapper__user__cart}
          style={{ color: pathname !== "/" ? "black" : "" }}
        >
          <Cart width={20} height={20} strokeWidth={1.75} />
          <span className={styles.wrapper__user__count}>[0]</span>
        </Link>

        <Link
          href={session.status === "authenticated" ? "/profile" : "/login"}
          className={styles.wrapper__user__profile}
          style={{ color: pathname !== "/" ? "black" : "" }}
        >
          <Image
            src={
              session.data?.user?.image
                ? session.data?.user?.image
                : "/profile.png"
            }
            alt="profile"
            width={50}
            height={50}
            priority
          />
        </Link>
      </div>
    </div>
  );
};

export default UserMenu;
