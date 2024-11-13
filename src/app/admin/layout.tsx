"use client";
import Sidebar from "@/components/layouts/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import styles from "./layout.module.scss";
import AdminHeader from "@/components/layouts/AdminHeader";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 990) {
        setIsMinimized(false);
      }
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className={styles.admin}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        ref={sidebarRef}
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimized}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <AdminHeader handleToggleSidebar={handleToggleSidebar} />
      <section
        ref={sectionRef}
        className={`${styles.admin__content} ${
          styles[`${isMinimized ? "minimize" : "maximize"}`]
        }`}
      >
        {children}
      </section>
    </main>
  );
};

export default AdminLayout;
