/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, ChevronRight, Edit, Trash, Trash2 } from "lucide-react";
import style from "./table.module.scss";
import { TypeStock, TypeUser } from "@/services/type.module";
import { Fragment } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SelectRow from "@/components/element/SelectRow";
import Checkbox from "@/components/element/Checkbox";
import Image from "next/image";
import { formatCurrency } from "@/utils/contant";

interface typeTable {
  thead: {
    title: string;
    padding: string;
    textAlign?: "left" | "center" | "right";
  }[];
  data: TypeUser[] | null;
  loading: boolean;
  setIsAllChecked: React.Dispatch<React.SetStateAction<boolean>>;
  isAllChecked: boolean;
  tbody: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  setIsDeleteOne: React.Dispatch<React.SetStateAction<any | null>>;
  setIsDeleteMany: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditData: React.Dispatch<React.SetStateAction<any | null>>;
  check: string[];
  setCheck: React.Dispatch<React.SetStateAction<string[]>>;
}

const TdComponent = (item: any, body: string) => {
  switch (body) {
    case "createdAt":
      return (
        <td style={{ textAlign: "center" }}>{item.createdAt?.split("T")[0]}</td>
      );
    case "description":
      return (
        <td className={`${style.table__description} `}>
          <p>{item?.description}</p>
        </td>
      );
    case "comment":
      return (
        <td className={`${style.table__description} `}>
          <p>{item?.comment}</p>
        </td>
      );
    case "image":
      return (
        <td className={`${style.table__image} `}>
          <Image
            src={item?.image}
            alt="image"
            width={200}
            height={200}
            priority
          />
        </td>
      );
    case "stock":
      return (
        <td style={{ textAlign: "center" }}>
          {item?.stock.reduce(
            (total: number, item: TypeStock) => total + (item?.stock || 0),
            0
          )}
        </td>
      );
    case "imageProduct":
      return (
        <td className={`${style.table__imageProduct} `}>
          <Image
            src={item?.image[0]}
            alt="image"
            width={100}
            height={100}
            priority
          />
        </td>
      );
    case "price":
      return (
        <td style={{ padding: "1rem 1rem" }}>{formatCurrency(item[body])}</td>
      );
    case "collectionName":
      return <td>{item?.collectionName?.name}</td>;
    case "value":
      return (
        <td
          style={{ textAlign: "center", userSelect: "none" }}
          title={item[body]}
        >
          {item[body]?.length}
        </td>
      );
    case "averageRating":
      return (
        <td style={{ textAlign: "center" }}>
          {item?.averageRating ? item.averageRating : 0}
        </td>
      );
    case "rating":
      return (
        <td style={{ textAlign: "center" }}>
          {item?.rating ? item.rating : 0}
        </td>
      );
    case "sold":
      return (
        <td style={{ textAlign: "center" }}>{item.sold ? item.sold : 0}</td>
      );
    case "code":
      return <td style={{ textTransform: "uppercase" }}>{item.code}</td>;
    case "percent":
      return <td style={{ textAlign: "center" }}>{item.percent} %</td>;

    default:
      return <td>{item?.[body]}</td>;
  }
};

const Table = ({
  thead,
  data,
  tbody,
  pagination,
  setIsDeleteOne,
  setIsDeleteMany,
  setIsEditData,
  loading,
  setCheck,
  check,
  setIsAllChecked,
  isAllChecked,
}: typeTable) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const { page, limit, total, totalPage } = pagination;

  console.log(pagination);

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
                  {thead.map((item, i) => (
                    <th
                      key={i + 1}
                      style={{
                        padding: item.padding,
                        textAlign: item.textAlign ? item.textAlign : "left",
                      }}
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data && data.length === 0 && (
                  <tr className={style.nodata}>
                    <td colSpan={thead.length + 1}>Data Tidak ada.</td>
                  </tr>
                )}
                {data &&
                  data.length > 0 &&
                  data?.map((items: TypeUser, i) => (
                    <tr
                      key={items._id}
                      style={{
                        borderBottom:
                          i + 1 === limit ? "none" : "1px solid #d9dffa",
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
                      {tbody.map((body, i) => (
                        <Fragment key={i}>{TdComponent(items, body)}</Fragment>
                      ))}
                      <td>
                        <div>
                          <button
                            className={style.edit}
                            onClick={() => setIsEditData(items)}
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

export default Table;
