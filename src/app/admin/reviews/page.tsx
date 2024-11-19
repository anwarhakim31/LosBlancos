"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./reviews.module.scss";
import InputSearch from "@/components/element/InputSearch";

import { useSearchParams } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";
import Table from "@/components/fragments/Table";

import ModalManyDelete from "@/components/fragments/ModalManyDelete";

import ModalOneDelete from "@/components/fragments/ModalOneDelete";

import { reviewService } from "@/services/review/method";
import ModalEditReview from "@/components/views/admin/reviews/ModalEditReview";
import { TypeReview } from "@/services/type.module";

const DiscountPage = () => {
  const params = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditData, setIsEditData] = useState<TypeReview | null>(null);
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
    { title: "Nama Pelanggan", padding: "1rem 1rem" },
    {
      title: "Nama Produk",
      padding: "1rem 1rem",
    },
    { title: "Rating", padding: "1rem 1rem", textAlign: "center" as const },
    { title: "komentar", padding: "0.5rem 2rem" },
    { title: "Tanggal", padding: "1rem 1rem", textAlign: "center" as const },
    { title: "", padding: "1rem 1rem" },
  ];
  const getData = useCallback(async () => {
    try {
      const searchParams = new URLSearchParams();

      searchParams.set("page", page.toString());
      searchParams.set("limit", limit.toString());
      searchParams.set("search", search.toString());

      const res = await reviewService.getAdmin(searchParams.toString());

      if (res.status === 200) {
        setData(res.data.reviews);
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

  console.log(data);

  return (
    <Fragment>
      <HeaderPage title="Ulasan" description="Kelola ulasan dari pelanggan." />
      <div className={styles.head}>
        <p>
          Semua Ulasan <span>({pagination.total})</span>
        </p>
        <div className={styles.head__search}>
          <InputSearch
            id="search"
            name="search"
            placeholder="Cari Komentar dari Ulasan"
            loading={loading}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        tbody={["user", "product", "rating", "comment", "createdAt"]}
        setIsAllChecked={setIsAllChecked}
        isAllChecked={isAllChecked}
      />

      {isDeleteMany ? (
        <ModalManyDelete
          onClose={() => setIsDeleteMany(false)}
          callback={() => getData()}
          title="Apakah anda yakin ingin menghapus data terpilih ?"
          setCheck={setCheck}
          fetching={() => reviewService.deleteAll(check)}
          setIsAllChecked={setIsAllChecked}
        />
      ) : null}

      {isDeleteOne ? (
        <ModalOneDelete
          onClose={() => setIsDeleteOne(null)}
          fetching={() => reviewService.deleteOne(isDeleteOne?._id as string)}
          title="Apakah anda yakin ingin menghapus data ini ?"
          callback={() => getData()}
        />
      ) : null}

      {isEditData ? (
        <ModalEditReview
          onClose={() => setIsEditData(null)}
          callback={() => getData()}
          isEditData={isEditData}
        />
      ) : null}
    </Fragment>
  );
};

export default DiscountPage;
