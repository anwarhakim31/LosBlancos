import React from "react";
import styles from "./adminheader.module.scss";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { AlignLeft, LogOut } from "lucide-react";

interface PropsType {
  handleToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const AdminHeader = ({ handleToggleSidebar, isSidebarOpen }: PropsType) => {
  const session = useSession();

  return (
    <div className={styles.header}>
      <button
        className={`${styles.header__button} ${isSidebarOpen && styles.active}`}
        onClick={handleToggleSidebar}
      >
        <AlignLeft width={16} height={16} />
      </button>
      <div className={styles.header__user}>
        <Link href={"/admin/profile"} className={styles.header__user__profile}>
          <Image
            src={
              session.data?.user?.image
                ? session.data?.user?.image
                : "/profile.png"
            }
            alt="profile"
            width={26}
            height={26}
            className={styles.header__user__profile__image}
          />
          <div className={styles.header__user__profile__detail}>
            <p>{session.data?.user?.name}</p>
          </div>
        </Link>

        <button
          className={styles.header__user__button}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut width={16} height={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
