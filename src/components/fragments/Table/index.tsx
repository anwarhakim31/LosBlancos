import { ChevronLeft, ChevronRight, Edit, Trash, Trash2 } from "lucide-react";
import style from "./table.module.scss";
import { TypeUser } from "@/services/type.module";
import { Fragment, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SelectRow from "@/components/element/SelectRow";
import Checkbox from "@/components/element/Checkbox";

interface typeTable {
  thead: {
    title: string;
    padding: string;
    textAlign?: "left" | "center" | "right";
  }[];
  data: TypeUser[] | null;
  loading: boolean;

  tbody: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  setIsDeleteOne: React.Dispatch<React.SetStateAction<TypeUser | null>>;
  setIsDeleteMany: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditData: React.Dispatch<React.SetStateAction<TypeUser | null>>;
  check: string[];
  setCheck: React.Dispatch<React.SetStateAction<string[]>>;
}

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

  const TdComponent = (item: TypeUser, body: string) => {
    switch (body) {
      case "createdAt":
        return (
          <td style={{ textAlign: "center" }}>
            {item.createdAt?.split("T")[0]}
          </td>
        );
      case "status":
        return (
          <td className={`${style.table__status} `}>
            <p className={`${item.status ? style.true : style.false}`}>
              {item.status?.toString()}
            </p>
          </td>
        );
      default:
        return <td>{item[body as keyof TypeUser]}</td>;
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