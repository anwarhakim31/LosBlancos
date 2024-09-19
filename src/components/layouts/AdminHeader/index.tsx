import React from "react";
import styles from "./adminheader.module.scss";
import { VscListSelection } from "react-icons/vsc";
interface PropsType {
  handleToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const AdminHeader = ({ handleToggleSidebar, isSidebarOpen }: PropsType) => {
  console.log(isSidebarOpen);

  return (
    <div className={styles.header}>
      <button
        className={`${styles.header__button} ${isSidebarOpen && styles.active}`}
        onClick={handleToggleSidebar}
      >
        <VscListSelection />
      </button>
      <div>s</div>
    </div>
  );
};

export default AdminHeader;
