"use client";

import HeaderPage from "@/components/element/HeaderPage";
import InputSearch from "@/components/element/InputSearch";
import { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./transaction.module.scss";
import TableTransaction from "@/components/views/admin/transaction/TableTransaction";
import { ResponseError } from "@/utils/axios/response-error";
import { transactionService } from "@/services/transaction/method";
import { useSearchParams } from "next/navigation";
import { TypeTransaction } from "@/services/type.module";
import ModalEditTransaction from "@/components/views/admin/transaction/ModalEditTransaction";
import ModalOneDelete from "@/components/fragments/ModalOneDelete";
import ModalManyDelete from "@/components/fragments/ModalManyDelete";

const TransactionPage = () => {
  const [pagination, setPagination] = useState({
    limit: 8,
    page: 1,
    totalPage: 0,
    total: 0,
  });
  const useParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(useParams.get("search") || "");
  const [data, setData] = useState([]);
  const [check, setCheck] = useState<string[]>([]);
  const [isChange, setIsChange] = useState<TypeTransaction | null>(null);
  const [isDeleteOne, setIsDeleteOne] = useState<TypeTransaction | null>(null);
  const [isDeleteMany, setIsDeleteMany] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const getData = useCallback(async () => {
    const params = new URLSearchParams(useParams.toString());

    try {
      const res = await transactionService.getAll(params.toString());

      if (res.status === 200) {
        setData(res.data.transaction);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  }, [useParams]);

  useEffect(() => {
    getData();
  }, [useParams, getData]);

  return (
    <Fragment>
      <HeaderPage
        title="Transaksi"
        description="Kelola dan memantau status dan detail semua transaksi yang terjadi."
      />{" "}
      <div className={styles.wrapper}>
        <p>
          Semua Transaksi{" "}
          <span> ({pagination.total ? pagination.total : 0})</span>
        </p>
        <div className={styles.wrapper__search}>
          <InputSearch
            id="search"
            name="search"
            placeholder="Cari transaksi"
            loading={loading}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <TableTransaction
        data={data}
        pagination={pagination}
        loading={loading}
        check={check}
        setCheck={setCheck}
        setIsChange={setIsChange}
        setIsDeleteOne={setIsDeleteOne}
        setIsDeleteMany={setIsDeleteMany}
        setIsAllChecked={setIsAllChecked}
        isAllChecked={isAllChecked}
      />
      {isChange && (
        <ModalEditTransaction
          onClose={() => setIsChange(null)}
          callback={getData}
          isEditData={isChange}
        />
      )}
      {isDeleteOne && (
        <ModalOneDelete
          onClose={() => setIsDeleteOne(null)}
          callback={getData}
          title="Apakah anda yakin ingin menghapus transaksi ini?"
          fetching={() =>
            transactionService.deleteOne(isDeleteOne._id as string)
          }
        />
      )}
      {isDeleteMany && (
        <ModalManyDelete
          onClose={() => setIsDeleteMany(false)}
          title="Apakah anda yakin ingin menghapus semua transaksi ini?"
          setCheck={setCheck}
          fetching={() => transactionService.deleteMany(check)}
          callback={getData}
          setIsAllChecked={setIsAllChecked}
        />
      )}
    </Fragment>
  );
};

export default TransactionPage;
