import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./usermenu.module.scss";
import Link from "next/link";
import Notelist from "@/assets/note.svg";
import Cart from "@/assets/cart.svg";
import Image from "next/image";
const UserMenu = () => {
  const session = useSession();
  const { push } = useRouter();

  return (
    <div className={styles.wrapper}>
      {session.status === "authenticated" ? (
        <div className={styles.wrapper__user}>
          <Link href={"/profile"} className={styles.wrapper__user__wishlist}>
            <Notelist width={20} height={20} strokeWidth={1.5} />
          </Link>

          <Link href={"/keranjang"} className={styles.wrapper__user__cart}>
            <Cart width={20} height={20} strokeWidth={1.75} />
          </Link>

          <Link href={"/profile"} className={styles.wrapper__user__profile}>
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
        <div className={styles.direct}>
          <button
            className={styles.wrapper__button}
            onClick={() => {
              push("/login");
            }}
          >
            Masuk
          </button>
          <button
            className={styles.wrapper__button}
            onClick={() => {
              push("/register");
            }}
          >
            Daftar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
