"use client";
import { ChevronLeft } from "lucide-react";
import styles from "./button.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ButtonBackPage = () => {
  const pathname = usePathname();

  const goBack = pathname.split("/").slice(0, -1).join("/");

  return (
    <div className={styles.wrapper}>
      <Link href={goBack} className={styles.wrapper__back}>
        <ChevronLeft width={18} height={18} strokeWidth={1.5} />
      </Link>
      <p className={styles.wrapper__title}>Kembali</p>
    </div>
  );
};

export default ButtonBackPage;
