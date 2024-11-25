"use client";

import HeaderPage from "@/components/element/HeaderPage";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./testi.module.scss";
import InputSearch from "@/components/element/InputSearch";

import { useSearchParams } from "next/navigation";
import { ResponseError } from "@/utils/axios/response-error";

import ModalManyDelete from "@/components/fragments/ModalManyDelete";

import ModalOneDelete from "@/components/fragments/ModalOneDelete";

import TableTestimonial from "@/components/views/admin/testimonial/TableTestimonial";
import { testimoniService } from "@/services/testi/method";
import { toast } from "sonner";

const TestimoniPage = () => {
  const params = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(params.get("search") || "");

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

  const getData = useCallback(async () => {
    try {
      const searchParams = new URLSearchParams();

      searchParams.set("page", page.toString());
      searchParams.set("limit", limit.toString());
      searchParams.set("search", search.toString());

      const res = await testimoniService.getAdmin(searchParams.toString());

      if (res.status === 200) {
        setData(res.data.testimoni);
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

  const handleStatus = async (id: string) => {
    try {
      const res = await testimoniService.status(id);

      if (res.status === 200) {
        toast.success(res.data.message);
        getData();
      }
    } catch (error) {
      ResponseError(error);
    }
  };

  return (
    <Fragment>
      <HeaderPage
        title="Testimoni"
        description="Kelola Testimoni dari pelanggan dan tampilkan di halaman utama."
      />
      <div className={styles.head}>
        <p>
          Semua Testimoni <span>({pagination.total})</span>
        </p>
        <div className={styles.head__search}>
          <InputSearch
            id="search"
            name="search"
            placeholder="Cari Komentar dari Testimoni"
            loading={loading}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <TableTestimonial
        data={data}
        loading={loading}
        pagination={pagination}
        isAllChecked={isAllChecked}
        check={check}
        setIsAllChecked={setIsAllChecked}
        setCheck={setCheck}
        setIsDeleteOne={setIsDeleteOne}
        setIsDeleteMany={setIsDeleteMany}
        handleStatus={handleStatus}
      />
      {isDeleteOne && (
        <ModalOneDelete
          onClose={() => setIsDeleteOne(null)}
          title="Apakah anda yakin ingin mengahapus testimoni ini?"
          fetching={() => testimoniService.deleteOne(isDeleteOne?._id)}
          callback={() => getData()}
        />
      )}
      {isDeleteMany && (
        <ModalManyDelete
          onClose={() => setIsDeleteMany(false)}
          title="Apakah anda yakin ingin mengahapus testimoni yang dipilih?"
          fetching={() => testimoniService.deletMany(check)}
          callback={() => getData()}
          setIsAllChecked={setIsAllChecked}
          setCheck={setCheck}
        />
      )}
    </Fragment>
  );
};

export default TestimoniPage;
