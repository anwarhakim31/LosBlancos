import Sidebar from "@/components/layouts/Sidebar";
import React from "react";
import styles from "./layout.module.scss";
import AdminHeader from "@/components/layouts/AdminHeader";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={styles.admin}>
      <Sidebar />
      <AdminHeader />
      <section className={styles.admin__content}>{children}</section>
    </main>
  );
};

export default AdminLayout;
