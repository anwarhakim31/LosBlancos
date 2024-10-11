import { useSession } from "next-auth/react";

import styles from "./usermenu.module.scss";
import Link from "next/link";
import Cart from "@/assets/cart.svg";
import Image from "next/image";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
const UserMenu = () => {
  const session = useSession();
  const pathname = usePathname();

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__user}>
        <Link
          href={"/profile"}
          className={styles.wrapper__user__wishlist}
          style={{ color: pathname !== "/" ? "black" : "" }}
        >
          <Heart width={19} height={19} strokeWidth={1.5} />
        </Link>

        <Link
          href={"/keranjang"}
          className={styles.wrapper__user__cart}
          style={{ color: pathname !== "/" ? "black" : "" }}
        >
          <Cart width={20} height={20} strokeWidth={1.75} />
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
    //   <div className={styles.direct}>
    //     <button
    //       className={styles.wrapper__button}
    //       onClick={() => {
    //         push("/login");
    //       }}
    //     >
    //       Masuk
    //     </button>
    //     <button
    //       className={styles.wrapper__button}
    //       onClick={() => {
    //         push("/register");
    //       }}
    //     >
    //       Daftar
    //     </button>
    //   </div>
  );
};

export default UserMenu;
