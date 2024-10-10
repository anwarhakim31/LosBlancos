import { useSession } from "next-auth/react";

import styles from "./usermenu.module.scss";
import Link from "next/link";
import Cart from "@/assets/cart.svg";
import Image from "next/image";
import { NotepadTextIcon } from "lucide-react";
const UserMenu = () => {
  const session = useSession();

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__user}>
        <Link href={"/profile"} className={styles.wrapper__user__wishlist}>
          <NotepadTextIcon width={20} height={20} strokeWidth={1.5} />
        </Link>

        <Link href={"/keranjang"} className={styles.wrapper__user__cart}>
          <Cart width={20} height={20} strokeWidth={1.75} />
        </Link>

        <Link
          href={session.status === "authenticated" ? "/profile" : "/login"}
          className={styles.wrapper__user__profile}
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
