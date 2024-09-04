"use client";
import HeaderPage from "@/components/element/HeaderPage";
import Table from "@/components/fragments/Table";
import { categoryService } from "@/services/category/method";
import { ResponseError } from "@/utils/axios/response-error";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./category.module.scss";
import InputSearch from "@/components/element/InputSearch";
import ButtonClick from "@/components/element/ButtonClick";
import { TypeCategory } from "@/services/type.module";

const CategoryPage = () => {
  const query = useSearchParams();
  const { push } = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPage: 0,
  });
  const [isDeleteOne, setIsDeleteOne] = useState<TypeCategory | null>(null);
  const [isDeleteMany, setIsDeleteMany] = useState(false);
  const [isEditData, setIsEditData] = useState<TypeCategory | null>(null);

  console.log(isEditData, isDeleteMany, isDeleteOne);

  const [check, setCheck] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const thead = [
    { title: "Nama", padding: "1rem 1rem" },
    { title: "gambar", padding: "1rem 1rem" },
    {
      title: "deskripsi",
      padding: "0.5rem 1rem",
    },
    { title: "", padding: "0.5rem 1rem" },
  ];

  const page =
    (query.get("page") && parseInt(query.get("page") as string)) ||
    pagination.page;
  const limit =
    (query.get("limit") && parseInt(query.get("limit") as string)) ||
    pagination.limit;

  const getAllCategory = useCallback(async () => {
    try {
      const params = { page, limit };

      const res = await categoryService.getCategory(params);

      if (res.status === 200) {
        setData(res.data.category);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    getAllCategory();
  }, [page, limit, getAllCategory]);

  return (
    <section>
      <HeaderPage
        title="Halaman Kategori"
        description="Kelola data kategori untuk mengelompokkan setiap produk."
      />
      <div className={styles.wrapper}>
        <p>
          Semua category{" "}
          <span> ({pagination.total ? pagination.total : 0})</span>
        </p>
        <div className={styles.wrapper__search}>
          <InputSearch
            id="search"
            name="search"
            placeholder="Cari Nama dari Kategori"
            loading={loading}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.wrapper__button}>
          <ButtonClick
            title={`Tambah Kategori`}
            onClick={() => push("/admin/category/add")}
          />
        </div>
      </div>

      <Table
        data={data}
        pagination={pagination}
        thead={thead}
        loading={loading}
        check={check}
        setCheck={setCheck}
        setIsDeleteMany={setIsDeleteMany}
        setIsDeleteOne={setIsDeleteOne}
        setIsEditData={setIsEditData}
        tbody={["name", "image", "description"]}
      />
    </section>
  );
};

export default CategoryPage;
