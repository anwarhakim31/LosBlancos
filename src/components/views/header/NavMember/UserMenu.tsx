import { useSession } from "next-auth/react";

import styles from "./usermenu.module.scss";
import Link from "next/link";
import Cart from "@/assets/cart.svg";
import Image from "next/image";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useEffect } from "react";

import { getWishlist } from "@/store/slices/wishSlice";

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((state) => state.wishlist);
  // const product = useAppSelector((state) => state.product.products);
  const session = useSession();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      {session.status === "authenticated" ? (
        <div className={styles.wrapper__user}>
          <Link
            href={"/wishlist"}
            className={styles.wrapper__user__wishlist}
            style={{ color: pathname !== "/" ? "black" : "" }}
          >
            <Heart width={20} height={20} strokeWidth={1.5} />
            {wishlist.length > 0 && (
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
      ) : (
        <div className={styles.wrapper__auth}>
          <button>
            <Link href={"/register"}>Daftar</Link>
          </button>
          <button>
            <Link href={"/login"}>Masuk</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
