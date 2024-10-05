"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./attibute.module.scss";
import InputSearch from "@/components/element/InputSearch";
import ButtonClick from "@/components/element/ButtonClick";
import ModalAddAttribute from "@/components/views/admin/atribut/ModalAddAttribute";
import { attributeService } from "@/services/attribute/method";
import { useSearchParams } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";

import Table from "@/components/fragments/Table";

const AttributePage = () => {
  const params = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState(null);
  const [isDeleteOne, setIsDeleteOne] = useState(null);
  const [isDeleteMany, setIsDeleteMany] = useState(false);
  const [check, setCheck] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPage: 0,
  });

  console.log(
    isDeleteOne,
    isDeleteMany,
    isEditData,
    setIsEditData,
    setIsDeleteOne,
    setIsDeleteMany
  );

  const limit = parseInt(params.get("limit") as string) || pagination.limit;
  const page = parseInt(params.get("page") as string) || pagination.page;
  const search = params.get("search") || "";

  const thead = [
    { title: "Nama", padding: "1rem 1rem" },

    {
      title: "Nilai",
      padding: "0.5rem 1rem",
      textAlign: "center" as const,
    },
    {
      title: "",
      padding: "0.5rem 1rem",
    },
  ];

  const getData = useCallback(async () => {
    try {
      const res = await attributeService.getAttribute(search, limit, page);
      console.log(res);
      if (res.status === 200) {
        setData(res.data.attribute);
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
        title="Halaman Atribut"
        description="Kelola atribut product sebagai karakteristik atau fitur yang menggambarkan suatu produk"
      />
      <div className={styles.head}>
        <p>
          Semua Atribut <span> </span>
        </p>
        <div className={styles.head__search}>
          <InputSearch
            id="search"
            name="search"
            placeholder="Cari Nama dari atribut"
            loading={loading}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.head__button}>
          <ButtonClick
            title={`Tambah Kategori`}
            onClick={() => setIsAddData(true)}
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
        setIsEditData={setIsAddData}
        setIsDeleteMany={setIsAddData}
        setIsDeleteOne={setIsAddData}
        tbody={["name", "value"]}
      />

      {isAddData ? (
        <ModalAddAttribute
          callback={() => getData()}
          onClose={() => setIsAddData(false)}
        />
      ) : null}
    </Fragment>
  );
};

export default AttributePage;
