"use client";
import HeaderPage from "@/components/element/HeaderPage";
import Table from "@/components/fragments/Table";
import { collectionSevice } from "@/services/category/method";
import { ResponseError } from "@/utils/axios/response-error";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./collection.module.scss";
import InputSearch from "@/components/element/InputSearch";
import ButtonClick from "@/components/element/ButtonClick";
import { TypeCollection } from "@/services/type.module";
import ModalManyDelete from "@/components/fragments/ModalManyDelete";
import ModalOneDelete from "@/components/fragments/ModalOneDelete";
import { useAppDispatch } from "@/store/hook";
import { setDataEdit } from "@/store/slices/actionSlice";

const CollectionPage = () => {
  const dispatch = useAppDispatch();
  const query = useSearchParams();
  const { push, replace } = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPage: 0,
  });
  const [isDeleteOne, setIsDeleteOne] = useState<TypeCollection | null>(null);
  const [isDeleteMany, setIsDeleteMany] = useState(false);

  const setIsEditData = (data: TypeCollection | null) => {
    dispatch(setDataEdit(data));
    replace(`/admin/collection/edit?id=${data?._id}`);
  };

  const [check, setCheck] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const thead = [
    { title: "Nama", padding: "1rem 1rem" },
    { title: "gambar", padding: "1rem 1rem", textAlign: "center" as const },
    {
      title: "deskripsi",
      padding: "0.5rem 1rem",
    },
    { title: "", padding: "0.5rem 1rem" },
  ];

  const search = query.get("search") || "";
  const page =
    (query.get("page") && parseInt(query.get("page") as string)) ||
    pagination.page;
  const limit =
    (query.get("limit") && parseInt(query.get("limit") as string)) ||
    pagination.limit;

  const getAllCollection = useCallback(async () => {
    try {
      const params = { page, limit, search };

      const res = await collectionSevice.getCollection(params);

      if (res.status === 200) {
        setData(res.data.collection);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    getAllCollection();
  }, [page, limit, searchQuery, getAllCollection]);

  return (
    <section>
      <HeaderPage
        title="Halaman Koleksi"
        description="Kelola koleksi produk untuk mengelompokkan berdasarkan tema"
      />
      <div className={styles.wrapper}>
        <p>
          Semua Koleksi{" "}
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
            title={`Tambah Koleksi`}
            onClick={() => push("/admin/collection/add")}
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
      {isDeleteMany && (
        <ModalManyDelete
          setCheck={() => setCheck([])}
          onClose={() => setIsDeleteMany(false)}
          title="Apakah anda yakin ingin mengapus kategori terpilih ?"
          callback={() => getAllCollection()}
          fetching={() => collectionSevice.deleteMany(check)}
        />
      )}
      {isDeleteOne && (
        <ModalOneDelete
          onClose={() => setIsDeleteOne(null)}
          title="Apakah anda yakin ingin menghapus kategori ini ?"
          callback={() => getAllCollection()}
          fetching={() =>
            collectionSevice.deleteOne(isDeleteOne?._id as string)
          }
        />
      )}
    </section>
  );
};

export default CollectionPage;
