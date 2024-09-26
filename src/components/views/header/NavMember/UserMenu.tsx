import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./usermenu.module.scss";
import Link from "next/link";

import Image from "next/image";
import { ShoppingCart, User } from "lucide-react";
const UserMenu = () => {
  const session = useSession();
  const { push } = useRouter();

  return (
    <div className={styles.wrapper}>
      {session.status === "authenticated" ? (
        <div className={styles.wrapper__user}>
          <Link href={"/keranjang"} className={styles.wrapper__user__cart}>
            <ShoppingCart />
          </Link>

          <Link href={"/profile"} className={styles.wrapper__user__profile}>
            {session.data?.user?.image ? (
              <Image
                src={session.data?.user?.image || ""}
                alt="profile"
                width={50}
                height={50}
                priority
              />
            ) : (
              <div className={styles.wrapper__user__profile__icon}>
                <User />
              </div>
            )}
            <p>{session.data?.user?.name}</p>
          </Link>
        </div>
      ) : (
        <button
          className={styles.wrapper__button}
          onClick={() => {
            push("/login");
          }}
        >
          Masuk
        </button>
      )}
    </div>
  );
};

export default UserMenu;
