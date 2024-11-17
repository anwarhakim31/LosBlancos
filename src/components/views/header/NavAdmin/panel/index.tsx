import React, { useEffect } from "react";
import styles from "./panel.module.scss";
import { X } from "lucide-react";

const PanelNotification = ({
  setIsOpen,
  showContent,
  setShowContent,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showContent: boolean;
  setShowContent: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    setShowContent(true);
  }, [setShowContent]);

  const handleClose = () => {
    setShowContent(false);

    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  // const list = () => {
  //   return (
  //     <>
  //       <li className={styles.panel__content__list}>
  //         <h5>Pesanan Baru masuk</h5>
  //       </li>
  //     </>
  //   );
  // };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div
        role="dialog"
        className={`${styles.panel} ${showContent && styles.show}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.panel__header}>
          <h3>Notifikasi</h3>
          <button
            type="button"
            aria-label="close"
            className={styles.panel__header__close}
            onClick={handleClose}
          >
            <X width={16} height={16} strokeWidth={1.5} />
          </button>
        </div>
        <button type="button" aria-label="mark" className={styles.panel__mark}>
          Tandai sudah baca
        </button>
        <ul className={styles.panel__content}>
          {/* <span>Belum ada notifikasi</span> */}
        </ul>
      </div>
    </div>
  );
};

export default PanelNotification;
