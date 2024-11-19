import { useEffect } from "react";
import styles from "./style.module.scss";
import Loader from "@/components/element/Loader";

const LoadingNavigate = ({ isNavigate }: { isNavigate: boolean }) => {
  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "hidden";
    }

    return () => {
      if (body) {
        body.style.overflow = "auto";
      }
    };
  }, [isNavigate]);

  return (
    <div className={styles.navigate_loading}>
      <Loader />
    </div>
  );
};

export default LoadingNavigate;
