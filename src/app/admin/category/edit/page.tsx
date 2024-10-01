"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import styles from "./edit.module.scss";
import HeaderPage from "@/components/element/HeaderPage";

const EditCategoryPage = () => {
  const { replace } = useRouter();
  const dataEdit = useAppSelector((state) => state.action.dataEdit);

  useEffect(() => {
    if (!dataEdit?._id && !dataEdit?.description && !dataEdit?.name) {
      replace("/admin/category");
    }
  }, [dataEdit, replace]);

  return (
    <section>
      <ButtonBackPage />
      <div className={styles.container}>
        <HeaderPage
          title="Halaman Edit Kategori"
          description="Edit data Kategori dengan mengisi form di bawah ini"
        />
      </div>
    </section>
  );
};

export default EditCategoryPage;
