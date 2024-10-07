"use client";
import HeaderPage from "@/components/element/HeaderPage";
import InputSearch from "@/components/element/InputSearch";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import styles from "./product.module.scss";
import ButtonClick from "@/components/element/ButtonClick";

const ProductAdminPage = () => {
  const { push } = useRouter();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(
    data,
    setData,
    pagination,
    setPagination,
    loading,
    setLoading,
    searchQuery,
    setSearchQuery
  );

  return (
    <Fragment>
      <HeaderPage title="Produk" description="Kelola data produk" />
      <div className={styles.wrapper}>
        <p>
          Semua Product{" "}
          <span> ({pagination.total ? pagination.total : 0})</span>
        </p>
        <div className={styles.wrapper__search}>
          <InputSearch
            id="search"
            name="search"
            placeholder="Cari Nama dari Kategori"
            loading={loading}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.wrapper__button}>
          <ButtonClick
            title={`Tambah Produk`}
            onClick={() => push("/admin/product/add")}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ProductAdminPage;
