"use client";
import HeaderPage from "@/components/element/HeaderPage";
import InputSearch from "@/components/element/InputSearch";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./product.module.scss";
import ButtonClick from "@/components/element/ButtonClick";
import Table from "@/components/fragments/Table";
import { productService } from "@/services/product/method";
import { ResponseError } from "@/utils/axios/response-error";
import ModalManyDelete from "@/components/fragments/ModalManyDelete";
import ModalOneDelete from "@/components/fragments/ModalOneDelete";
import { TypeProduct } from "@/services/type.module";
import { useAppDispatch } from "@/store/hook";
import { setEditProduct } from "@/store/slices/actionSlice";

const ProductAdminPage = () => {
  const dispatch = useAppDispatch();
  const { push } = useRouter();
  const query = useSearchParams();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [check, setCheck] = useState<string[]>([]);
  const [isDeleteOne, setIsDeleteOne] = useState<TypeProduct | null>(null);
  const [isDeleteMany, setIsDeleteMany] = useState(false);

  const page = parseInt(query.get("page") as string) || pagination.page;
  const limit = parseInt(query.get("limit") as string) || pagination.limit;
  const search = query.get("search") || "";

  const getData = useCallback(async () => {
    try {
      const res = await productService.getProducts(search, page, limit);

      if (res.status === 200) {
        setData(res.data.products);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    getData();
  }, [getData, search, page, limit]);

  const thead = [
    { title: "Nama", padding: "1rem 1rem" },
    { title: "Gambar", padding: "1rem 2rem", textAlign: "center" as const },
    { title: "Harga", padding: "1rem 1rem" },
    { title: "Stok", padding: "1rem 1rem", textAlign: "center" as const },
    { title: "Koleksi", padding: "1rem 1rem" },
    { title: "Atribut", padding: "1rem 1rem" },
    { title: "", padding: "1rem 1rem" },
  ];
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
            placeholder="Cari Nama dari product"
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
      <Table
        data={data}
        pagination={pagination}
        thead={thead}
        loading={loading}
        tbody={[
          "name",
          "imageProduct",
          "price",
          "stock",
          "collectionName",
          "attribute",
        ]}
        setIsDeleteOne={setIsDeleteOne}
        setIsDeleteMany={setIsDeleteMany}
        setIsEditData={(dataEdit) => {
          dispatch(setEditProduct(dataEdit));
          push("/admin/product/edit?id=" + dataEdit._id);
        }}
        setCheck={setCheck}
        check={check}
      />
      {isDeleteMany && (
        <ModalManyDelete
          title="Apakah anda yakin ingin menghapus data terpilih ?"
          onClose={() => setIsDeleteMany(false)}
          setCheck={setCheck}
          callback={() => getData()}
          fetching={() => productService.deleteMany(check)}
        />
      )}
      {isDeleteOne && (
        <ModalOneDelete
          title="Apakah anda yakin ingin menghapus data ?"
          onClose={() => setIsDeleteOne(null)}
          callback={() => getData()}
          fetching={() => productService.deleteOne(isDeleteOne._id as string)}
        />
      )}
    </Fragment>
  );
};

export default ProductAdminPage;
