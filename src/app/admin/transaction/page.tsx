"use client";

import HeaderPage from "@/components/element/HeaderPage";
import InputSearch from "@/components/element/InputSearch";
import { Fragment, useCallback, useEffect, useState } from "react";
import styles from "./transaction.module.scss";
import TableTransaction from "@/components/views/admin/transaction/TableTransaction";
import { ResponseError } from "@/utils/axios/response-error";
import { transactionService } from "@/services/transaction/method";
import { useSearchParams } from "next/navigation";

const TransactionPage = () => {
  const [pagination, setPagination] = useState({
    limit: 8,
    page: 1,
    totalPage: 0,
    total: 0,
  });
  const useParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [check, setCheck] = useState<string[]>([]);

  const getData = useCallback(async () => {
    setLoading(true);
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
      />
    </Fragment>
  );
};

export default TransactionPage;
