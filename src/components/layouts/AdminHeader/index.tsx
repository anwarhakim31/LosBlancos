import React from "react";
import styles from "./adminheader.module.scss";
import { VscListSelection } from "react-icons/vsc";
import { RxExit } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

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
        <VscListSelection />
      </button>
      <div className={styles.header__user}>
        <div className={styles.header__user__profile}>
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
        </div>

        <button className={styles.header__user__button}>
          <IoSettingsOutline size={"1rem"} />
        </button>
        <button
          className={styles.header__user__button}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <RxExit />
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
