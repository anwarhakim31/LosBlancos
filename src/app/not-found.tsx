import Link from "next/link";
import styles from "./root.module.scss";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>4 0 4</h1>
        <p>Halaman yang anda cari tidak ditemukan.</p>
        <Link href="/">Kembali</Link>
      </div>
    </div>
  );
}
