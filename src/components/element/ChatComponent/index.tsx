"use client";
import React from "react";
import styles from "./chat.module.scss";
import Image from "next/image";
import { useMasterContext } from "@/context/MasterContext";
import Link from "next/link";

const ChatComponent = () => {
  const context = useMasterContext();

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
