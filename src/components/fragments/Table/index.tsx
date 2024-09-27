import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import style from "./table.module.scss";
import { TypeUser } from "@/services/type.module";
import { Fragment } from "react";

interface typeTable {
  thead: {
    title: string;
    padding: string;
  }[];
  data: TypeUser[];
  loading: boolean;
  page: number;
  limit: number;
  tbody: string[];
  setPage: (page: number) => void;
  setIsDeleteOne: (isDeleteOne: TypeUser) => void;
}

const Table = ({
  thead,
  data,
  tbody,
  page,
  limit,
  setPage,
  setIsDeleteOne,
  loading,
}: typeTable) => {
  const lastIndex = page * limit;
  const firstIndex = lastIndex - limit;
  //   const dataSlice = data?.slice(firstIndex, lastIndex);
  const totalPage = Math.ceil(data?.length / limit);

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
                {data?.map((items: TypeUser) => (
                  <tr key={items._id}>
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
              Menampilkan {firstIndex + 1} -
              {page === totalPage ? data?.length : lastIndex} dari{" "}
              {data?.length} data
            </p>
            <div className={style.pagination__btnwrapper}>
              <button
                className={style.pagination__prev}
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft width={16} height={16} />
              </button>
              {visiblePage.map((item) => (
                <button
                  key={item}
                  className={`${style.pagination__btn} ${
                    page === item && style["pagination__btn__active"]
                  }`}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ))}

              <button
                className={style.pagination__next}
                onClick={() => setPage(page + 1)}
                disabled={page === totalPage}
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
