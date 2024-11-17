import React, { Fragment, useEffect } from "react";
import styles from "./panel.module.scss";
import { X } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import { formatDateMessage, formatTime } from "@/utils/contant";
import { ResponseError } from "@/utils/axios/response-error";
import { notifMethod } from "@/services/notification/method";
import { useRouter } from "next/navigation";

const PanelNotification = ({
  setIsOpen,
  showContent,
  setShowContent,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showContent: boolean;
  setShowContent: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const socket = useSocket();
  const router = useRouter();

  useEffect(() => {
    setShowContent(true);
  }, [setShowContent]);

  const handleClose = () => {
    setShowContent(false);

    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const handleReadMany = async () => {
    socket?.setNotif([]);

    setShowContent(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);

    try {
      await notifMethod.makeReadAll();
    } catch (error) {
      ResponseError(error);
    }
  };

  const handleReadOne = async (
    messageId: string,
    dataId: string,
    title: string
  ) => {
    router.prefetch(
      title.includes("Pesanan")
        ? "/admin/transaction/" + dataId
        : "/admin/product/edit?id=" + dataId
    );
    socket?.setNotif(
      socket.notif.filter((item: { _id: string }) => item._id !== messageId)
    );

    setShowContent(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
    title.includes("Pesanan")
      ? router.push("/admin/transaction/" + dataId)
      : router.push("/admin/product/edit?id=" + dataId);

    try {
      await notifMethod.makeReadOne(messageId, dataId);
    } catch (error) {
      ResponseError(error);
    }
  };

  const list = () => {
    let lastDate: string | null = null;
    return socket?.notif?.map((item) => {
      const messageDate = new Date(item?.createdAt);
      const normalizedDate = messageDate.toISOString().split("T")[0];

      const showDate = normalizedDate !== lastDate;
      lastDate = normalizedDate;

      return (
        <Fragment key={item?._id}>
          {showDate && (
            <li className={styles.panel__content__date}>
              {formatDateMessage(item?.createdAt)}
            </li>
          )}
          <li
            className={styles.panel__content__list}
            onClick={() => handleReadOne(item._id, item.dataId, item.title)}
          >
            <h5>{item?.title}</h5>
            <p>{item?.description}</p>
            <p style={{ marginTop: "5px" }}>{formatTime(item?.createdAt)}</p>
          </li>
        </Fragment>
      );
    });
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div
        role="dialog"
        className={`${styles.panel} ${showContent && styles.show}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.panel__sticky}>
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
          {socket?.notif && socket?.notif?.length > 0 && (
            <button
              type="button"
              aria-label="mark"
              className={styles.panel__mark}
              onClick={handleReadMany}
            >
              Tandai sudah baca
            </button>
          )}
        </div>
        <ul className={styles.panel__content}>
          {socket?.notif?.length === 0 && <span>Belum ada notifikasi</span>}
          {list()}
        </ul>
      </div>
    </div>
  );
};

export default PanelNotification;
