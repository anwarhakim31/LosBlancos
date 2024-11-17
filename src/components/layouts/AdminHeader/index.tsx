import React, { useEffect, useRef } from "react";
import styles from "./adminheader.module.scss";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { AlignLeft, Bell, BellRing, LogOut } from "lucide-react";

import PanelNotification from "@/components/views/header/NavAdmin/panel";
import { useSocket } from "@/context/SocketContext";

interface PropsType {
  handleToggleSidebar: () => void;
}

const AdminHeader = ({ handleToggleSidebar }: PropsType) => {
  const session = useSession();
  const socket = useSocket();

  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowContent(false);
        setTimeout(() => {
          setIsOpen(false);
        }, 300);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleClick = () => {
    if (isButtonDisabled) return;

    setIsButtonDisabled(true);

    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        setShowContent(true);
      }, 300);
    }

    if (isOpen) {
      setShowContent(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 300);
    }

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 400);
  };

  return (
    <div className={styles.header}>
      <button
        className={`${styles.header__button} `}
        onClick={handleToggleSidebar}
      >
        <AlignLeft width={16} height={16} />
      </button>
      <div className={styles.header__user}>
        <div ref={ref} className={styles.wrapper}>
          <button
            type="button"
            className={styles.button}
            aria-label="notification"
            onClick={handleClick}
            disabled={socket?.loading}
          >
            {socket?.notif && socket?.notif?.length > 0 ? (
              <BellRing width={16} height={16} strokeWidth={1.5} />
            ) : (
              <Bell width={16} height={16} strokeWidth={1.5} />
            )}
          </button>

          {isOpen && (
            <PanelNotification
              setShowContent={setShowContent}
              showContent={showContent}
              setIsOpen={setIsOpen}
            />
          )}
        </div>

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
            <span>Administrator</span>
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
