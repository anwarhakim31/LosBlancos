"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./category.module.scss";
import InputSearch from "@/components/element/InputSearch";
import ButtonClick from "@/components/element/ButtonClick";
import { useSearchParams } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";
import Table from "@/components/fragments/Table";
import ModalAddCategory from "@/components/views/admin/category/ModalAddCategory";
import ModalManyDelete from "@/components/fragments/ModalManyDelete";

import { categoryService } from "@/services/category/method";
import ModalOneDelete from "@/components/fragments/ModalOneDelete";
import { TypeCategory } from "@/services/type.module";
import ModalEditCategory from "@/components/views/admin/category/ModalEditCategory";

const CategoryPage = () => {
  const params = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState<TypeCategory | null>(null);
  const [isDeleteOne, setIsDeleteOne] = useState<TypeCategory | null>(null);
  const [isDeleteMany, setIsDeleteMany] = useState(false);
  const [check, setCheck] = useState<string[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPage: 0,
  });

  const limit = parseInt(params.get("limit") as string) || pagination.limit;
  const page = parseInt(params.get("page") as string) || pagination.page;
  const search = params.get("search") || "";

  const thead = [
    { title: "Nama", padding: "1rem 1rem" },
    { title: "", padding: "1rem 1rem" },
  ];

  const getData = useCallback(async () => {
    try {
      const res = await categoryService.get(search, limit, page);
      if (res.status === 200) {
        setData(res.data.category);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  }, [limit, page, search]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Fragment>
      <HeaderPage
        title="Halaman Kategori"
        description="Kelola atribut product sebagai karakteristik atau fitur yang menggambarkan suatu produk"
      />
      <div className={styles.head}>
        <p>
          Semua Kategori <span> </span>
        </p>
        <div className={styles.head__search}>
          <InputSearch
            id="search"
            name="search"
            placeholder="Cari Nama dari Kategori"
            loading={loading}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.head__button}>
          <ButtonClick
            title={`Tambah Kategori`}
            onClick={() => setIsAddData(true)}
            loading={loading}
          />
        </div>
      </div>
      <Table
        data={data}
        pagination={pagination}
        loading={loading}
        setCheck={setCheck}
        thead={thead}
        check={check}
        setIsEditData={setIsEditData}
        setIsDeleteMany={setIsDeleteMany}
        setIsDeleteOne={setIsDeleteOne}
        tbody={["name"]}
        setIsAllChecked={setIsAllChecked}
        isAllChecked={isAllChecked}
      />

      {isAddData ? (
        <ModalAddCategory
          callback={() => getData()}
          onClose={() => setIsAddData(false)}
        />
      ) : null}

      {isDeleteMany ? (
        <ModalManyDelete
          onClose={() => setIsDeleteMany(false)}
          callback={() => getData()}
          title="Apakah anda yakin ingin menghapus kategori terpilih ?"
          setCheck={setCheck}
          fetching={() => categoryService.deleteMany(check)}
          setIsAllChecked={setIsAllChecked}
        />
      ) : null}

      {isDeleteOne ? (
        <ModalOneDelete
          onClose={() => setIsDeleteOne(null)}
          fetching={() => categoryService.deleteOne(isDeleteOne?._id as string)}
          title="Apakah anda yakin ingin menghapus kategori ini ?"
          callback={() => getData()}
        />
      ) : null}

      {isEditData ? (
        <ModalEditCategory
          onClose={() => setIsEditData(null)}
          callback={() => getData()}
          isEditData={isEditData}
        />
      ) : null}
    </Fragment>
  );
};

export default CategoryPage;
