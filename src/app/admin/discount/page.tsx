"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./discount.module.scss";
import InputSearch from "@/components/element/InputSearch";
import ButtonClick from "@/components/element/ButtonClick";
import { useSearchParams } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";
import Table from "@/components/fragments/Table";

import ModalManyDelete from "@/components/fragments/ModalManyDelete";

import ModalOneDelete from "@/components/fragments/ModalOneDelete";

import { diskonService } from "@/services/discount/method";
import ModalAddDiskon from "@/components/views/admin/diskon/ModalAddDiskon";
import ModalEditDiskon from "@/components/views/admin/diskon/ModalEditDiskon";

const DiscountPage = () => {
  const params = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(params.get("search") || "");
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState<{
    _id: string;
    code: string;
    percent: number | null;
    info: string;
  } | null>(null);
  const [isDeleteOne, setIsDeleteOne] = useState<{
    _id: string;
    code: string;
    percent: number | null;
    info: string;
  } | null>(null);
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
    { title: "Kode", padding: "1rem 1rem" },
    { title: "Persentase", padding: "1rem 1rem", textAlign: "center" as const },
    { title: "Keterangan", padding: "1rem 1rem" },
    { title: "", padding: "1rem 1rem" },
  ];

  const getData = useCallback(async () => {
    try {
      const searchParams = new URLSearchParams();

      searchParams.set("page", page.toString());
      searchParams.set("limit", limit.toString());
      searchParams.set("search", search.toString());

      const res = await diskonService.get(searchParams.toString());
      if (res.status === 200) {
        setData(res.data.diskon);
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
        title="Diskon"
        description="Kelola Diskon yang digunakan untuk mengurangi harga barang pada toko"
      />
      <div className={styles.head}>
        <p>
          Semua Diskon<span>{pagination.total}</span>
        </p>
        <div className={styles.head__search}>
          <InputSearch
            id="search"
            name="search"
            placeholder="Cari Kode atau Deskripsi dari Diskon"
            loading={loading}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.head__button}>
          <ButtonClick
            title={`Tambah Diskon`}
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
        tbody={["code", "percent", "info"]}
        setIsAllChecked={setIsAllChecked}
        isAllChecked={isAllChecked}
      />

      {isAddData ? (
        <ModalAddDiskon
          callback={() => getData()}
          onClose={() => setIsAddData(false)}
        />
      ) : null}

      {isDeleteMany ? (
        <ModalManyDelete
          onClose={() => setIsDeleteMany(false)}
          callback={() => getData()}
          title="Apakah anda yakin ingin menghapus data terpilih ?"
          setCheck={setCheck}
          fetching={() => diskonService.deleteMany(check)}
          setIsAllChecked={setIsAllChecked}
        />
      ) : null}

      {isDeleteOne ? (
        <ModalOneDelete
          onClose={() => setIsDeleteOne(null)}
          fetching={() => diskonService.deleteOne(isDeleteOne?._id as string)}
          title="Apakah anda yakin ingin menghapus data ini ?"
          callback={() => getData()}
        />
      ) : null}

      {isEditData ? (
        <ModalEditDiskon
          onClose={() => setIsEditData(null)}
          callback={() => getData()}
          isEditData={isEditData}
        />
      ) : null}
    </Fragment>
  );
};

export default DiscountPage;
