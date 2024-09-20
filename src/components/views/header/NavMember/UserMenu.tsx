import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./usermenu.module.scss";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
const UserMenu = () => {
  const session = useSession();
  const { push } = useRouter();

  return (
    <div className={styles.wrapper}>
      {session.status === "authenticated" ? (
        <div className={styles.wrapper__user}>
          <Link href={"/keranjang"} className={styles.wrapper__user__cart}>
            <FaCartShopping />
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
                <FaUser />
              </div>
            )}

            <p>{session.data?.user?.fullname}</p>
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
