"use client";
import Sidebar from "@/components/layouts/Sidebar";
import React, { useRef, useState } from "react";
import styles from "./layout.module.scss";
import AdminHeader from "@/components/layouts/AdminHeader";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main className={styles.admin}>
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <AdminHeader
        handleToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <section ref={sectionRef} className={styles.admin__content}>
        {children}
      </section>
    </main>
  );
};

export default AdminLayout;
