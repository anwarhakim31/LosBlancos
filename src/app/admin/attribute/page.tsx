"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./attibute.module.scss";
import InputSearch from "@/components/element/InputSearch";
import ButtonClick from "@/components/element/ButtonClick";
import { useSearchParams } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";
import Table from "@/components/fragments/Table";
import ModalManyDelete from "@/components/fragments/ModalManyDelete";
import ModalOneDelete from "@/components/fragments/ModalOneDelete";
import { TypeAttribute } from "@/services/type.module";
import ModalEditAtrribute from "@/components/views/admin/atribut/ModalEditAttribute";
import ModalAddAttribute from "@/components/views/admin/atribut/ModalAddAttribute";
import { attributeService } from "@/services/attribute/method";

const AttributePage = () => {
  const params = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState<TypeAttribute | null>(null);
  const [isDeleteOne, setIsDeleteOne] = useState<TypeAttribute | null>(null);
  const [isDeleteMany, setIsDeleteMany] = useState(false);
  const [check, setCheck] = useState<string[]>([]);
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
        setIsEditData={setIsEditData}
        setIsDeleteMany={setIsDeleteMany}
        setIsDeleteOne={setIsDeleteOne}
        tbody={["name", "value"]}
      />

      {isAddData ? (
        <ModalAddAttribute
          callback={() => getData()}
          onClose={() => setIsAddData(false)}
        />
      ) : null}

      {isDeleteMany ? (
        <ModalManyDelete
          onClose={() => setIsDeleteMany(false)}
          callback={() => getData()}
          title="Apakah anda yakin ingin menghapus atribut terpilih ?"
          setCheck={setCheck}
          fetching={() => attributeService.deleteMany(check)}
        />
      ) : null}

      {isDeleteOne ? (
        <ModalOneDelete
          onClose={() => setIsDeleteOne(null)}
          fetching={() =>
            attributeService.deleteOne(isDeleteOne?._id as string)
          }
          title="Apakah anda yakin ingin menghapus atribut ini ?"
          callback={() => getData()}
        />
      ) : null}

      {isEditData ? (
        <ModalEditAtrribute
          onClose={() => setIsEditData(null)}
          callback={() => getData()}
          isEditData={isEditData}
        />
      ) : null}
    </Fragment>
  );
};

export default AttributePage;
