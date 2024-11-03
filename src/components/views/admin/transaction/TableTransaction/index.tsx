/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Trash,
  Trash2,
} from "lucide-react";
import style from "./table.module.scss";
import { TypeTransaction } from "@/services/type.module";
import { Fragment, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SelectRow from "@/components/element/SelectRow";
import Checkbox from "@/components/element/Checkbox";
import { formatCurrency, formateDate } from "@/utils/contant";

interface typeTable {
  data: TypeTransaction[] | null;
  loading: boolean;

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  setIsDeleteOne: React.Dispatch<React.SetStateAction<any | null>>;
  setIsDeleteMany: React.Dispatch<React.SetStateAction<boolean>>;

  setIsChange: React.Dispatch<React.SetStateAction<any | null>>;
  check: string[];
  setCheck: React.Dispatch<React.SetStateAction<string[]>>;
}

const TableTransaction = ({
  data,

  pagination,
  setIsDeleteOne,
  setIsDeleteMany,
  setIsChange,
  loading,
  setCheck,
  check,
}: typeTable) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const [isAllChecked, setIsAllChecked] = useState(false);

  const { page, limit, total, totalPage } = pagination;

  const lastIndex = page > totalPage ? 0 : page * limit;
  const firstIndex = lastIndex - limit;

  const pageNumber = [];

  for (let i = 1; i <= totalPage; i++) {
    pageNumber.push(i);
  }

  const startPage =
    page === totalPage ? Math.max(1, page - 2) : Math.max(1, page - 1);
  const endPage =
    page === 1 ? Math.min(totalPage, page + 2) : Math.min(totalPage, page + 1);

  const visiblePage = pageNumber.slice(startPage - 1, endPage);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setCheck((prev) => [...prev, id.toString()]);
    } else {
      setCheck((prev) => prev.filter((item) => item !== id.toString()));
    }
  };

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAllChecked(!isAllChecked);

    if (!e.target.checked) {
      setCheck([]);
    } else {
      setCheck(
        data
          ?.filter((item) => item?._id !== undefined)
          .map((item) => item?._id!.toString()) || []
      );
    }
  };

  return (
    <div className={style.container}>
      <div className={style.setting}>
        <button
          className={`${style.deleteAll} ${
            check?.length > 0
              ? style.deleteAll__active
              : style.deleteAll__disable
          }`}
          disabled={check?.length === 0}
          onClick={() => setIsDeleteMany(true)}
        >
          <Trash2 />
        </button>
        <SelectRow limit={limit} />
      </div>
      {loading ? (
        <div className={style.loading}>
          <div className={style.loading__shimmer}></div>
        </div>
      ) : (
        <Fragment>
          <div className={style.wrapper}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>
                    <Checkbox
                      id="all"
                      onChange={handleCheckAll}
                      checked={isAllChecked}
                      style={{ border: "1px solid white" }}
                    />
                  </th>
                  <th>Tanggal</th>
                  <th>Invoice</th>
                  <th>Pelanggan</th>
                  <th>Total Harga</th>
                  <th style={{ textAlign: "center" }}>Status Pembayaran</th>
                  <th style={{ textAlign: "center" }}>statu Transaksi</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {data && data.length === 0 && (
                  <tr className={style.nodata}>
                    <td colSpan={8}>Data Tidak ada.</td>
                  </tr>
                )}
                {data &&
                  data.length > 0 &&
                  data?.map((items: TypeTransaction, i) => (
                    <tr
                      key={items._id}
                      style={{
                        borderBottom:
                          i + 1 === lastIndex ? "none" : "1px solid #d9dffa",
                      }}
                    >
                      <td>
                        <Checkbox
                          checked={
                            items._id !== undefined &&
                            check !== null &&
                            check.some((item: string) => item === items._id)
                          }
                          onChange={(e) =>
                            handleCheck(
                              e,
                              items._id !== undefined ? items._id : ""
                            )
                          }
                          id={items._id}
                        />
                      </td>
                      <td>{formateDate(items?.transactionDate)}</td>
                      <td>{items?.invoice}</td>
                      <td>{items?.userId.fullname}</td>
                      <td>
                        {formatCurrency(
                          items?.subtotal + 1000 + items?.shippingCost
                        )}
                      </td>
                      <td className={`${style.table__status} `}>
                        <p
                          className={`${
                            items?.paymentStatus === "tertunda"
                              ? style.tertunda
                              : ""
                          } ${
                            items?.paymentStatus === "dibatalkan" ||
                            items?.paymentStatus === "kadaluwarsa"
                              ? style.dibatalkan
                              : style.dibayar
                          }`}
                        >
                          {" "}
                          {items.paymentStatus}
                        </p>
                      </td>
                      <td className={`${style.table__status} `}>
                        <p
                          className={`${
                            items?.transactionStatus === "tertunda"
                              ? style.tertunda
                              : ""
                          } ${
                            items?.transactionStatus === "dibatalkan"
                              ? style.dibatalkan
                              : style.dibayar
                          }`}
                        >
                          {items?.transactionStatus}
                        </p>
                      </td>
                      <td>
                        <div>
                          <button>
                            <Eye width={16} height={16} />
                          </button>
                          <button
                            className={style.edit}
                            onClick={() => setIsChange(items)}
                          >
                            <Edit width={16} height={16} />
                          </button>
                          <button
                            className={style.trash}
                            onClick={() => setIsDeleteOne(items)}
                          >
                            <Trash width={16} height={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={style.pagination}>
            <p>
              Menampilkan {page > totalPage ? 0 : firstIndex + 1} -
              {page === totalPage ? total : lastIndex} dari {total} data
            </p>
            <div className={style.pagination__btnwrapper}>
              <button
                className={style.pagination__prev}
                disabled={page === 1}
                onClick={() => {
                  setCheck([]);
                  setIsAllChecked(false);
                  const params = new URLSearchParams(query.toString());
                  params.set("page", (page - 1).toString());

                  replace(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
              >
                <ChevronLeft width={16} height={16} />
              </button>
              {visiblePage.map((item) => (
                <button
                  key={item}
                  className={`${style.pagination__btn} ${
                    page === item && style["pagination__btn__active"]
                  }`}
                  onClick={() => {
                    setCheck([]);
                    setIsAllChecked(false);
                    const params = new URLSearchParams(query.toString());
                    params.set("page", item.toString());

                    replace(`${pathname}?${params.toString()}`, {
                      scroll: false,
                    });
                  }}
                >
                  {item}
                </button>
              ))}

              <button
                className={style.pagination__next}
                onClick={() => {
                  setCheck([]);
                  setIsAllChecked(false);
                  const params = new URLSearchParams(query.toString());
                  params.set("page", (page + 1).toString());

                  replace(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                disabled={page >= totalPage}
              >
                <ChevronRight width={16} height={16} />
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default TableTransaction;
