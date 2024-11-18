"use client";
import React from "react";
import styles from "./chat.module.scss";
import Image from "next/image";
import { useMasterContext } from "@/context/MasterContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const notAllow = ["/login", "/register", "/forget-password", "/reset-password"];

const ChatComponent = () => {
  const context = useMasterContext();
  const pathname = usePathname();

  if (pathname.startsWith("/admin/") || notAllow.includes(pathname)) {
    return null;
  }
  return (
    <Link
      href={`https://wa.me/${context?.master?.phone}`}
      aria-label="chat admin"
      target="__blank"
      className={styles.chat}
    >
      <Image src={"/wa.svg"} alt="chat" width={32} height={32} />
    </Link>
  );
};

export default ChatComponent;
