import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import style from "./table.module.scss";
import { TypeUser } from "@/services/type.module";
import { Fragment } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SelectRow from "@/components/element/SelectRow";

interface typeTable {
  thead: {
    title: string;
    padding: string;
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
  setIsDeleteOne: (isDeleteOne: TypeUser) => void;
}

const Table = ({
  thead,
  data,
  tbody,
  pagination,
  setIsDeleteOne,
  loading,
}: typeTable) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

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

  return (
    <div className={style.container}>
      <div className={style.setting}>
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
                  {thead.map((item, i) => (
                    <th
                      key={i + 1}
                      style={{
                        padding: item.padding,
                      }}
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((items: TypeUser, i) => (
                  <tr
                    key={items._id}
                    style={{
                      borderBottom:
                        i + 1 === lastIndex ? "none" : "1px solid #d9dffa",
                    }}
                  >
                    {tbody.map((body, i) => (
                      <Fragment key={i}>
                        <td>{items[body as keyof TypeUser]}</td>
                      </Fragment>
                    ))}
                    <td>
                      <div>
                        <button className={style.edit}>
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
