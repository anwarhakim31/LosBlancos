import { Fragment, ReactNode, useEffect, useState } from "react";
import styles from "./portal.module.scss";
import { createPortal } from "react-dom";

const BackdropOverlay = ({ onClose }: { onClose: () => void }) => {
  return <div onClick={onClose} className={styles.backdropOverlay}></div>;
};

const ModalOverlay = ({
  children,
  onClose,
  showModal,
}: {
  children: ReactNode | null;
  onClose: () => void;
  showModal: boolean;
}) => {
  return (
    <div
      onClick={onClose}
      className={`${styles.modalOverlay} ${
        showModal ? styles.active : styles.default
      }`}
    >
      {children}
    </div>
  );
};

const Modal = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [portalElement, setPortalElement] = useState<Element | null>(null);

  useEffect(() => {
    const element = document.getElementById("modal-root");
    setPortalElement(element);
    setIsMounted(true);
    const timeout = setTimeout(() => {
      setShowModal(true);
    }, 10);

    return () => {
      clearTimeout(timeout);
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    }
  }, [showModal]);

  if (!isMounted || !portalElement) return null;

  return (
    <Fragment>
      {isMounted &&
        createPortal(
          <BackdropOverlay onClose={onClose}></BackdropOverlay>,
          portalElement!
        )}
      {isMounted &&
        createPortal(
          <ModalOverlay onClose={onClose} showModal={showModal}>
            {children}
          </ModalOverlay>,
          portalElement!
        )}
    </Fragment>
  );
};

export default Modal;
