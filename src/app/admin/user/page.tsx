"use client";

import HeaderAdmin from "@/components/element/HeaderAdmin";
import style from "./user.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const UserPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);
  const [data, setData] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);

  const lastIndex = page * limit;
  const firstIndex = lastIndex - limit;
  const dataSlice = data.slice(firstIndex, lastIndex);
  const totalPage = Math.ceil(data.length / limit);

  const pageNumber = [];

  const handleClick = () => {
    setLimit(1);
    setData([]);
  };

  for (let i = 1; i <= totalPage; i++) {
    pageNumber.push(i);
  }

  const startPage =
    page === totalPage ? Math.max(1, page - 2) : Math.max(1, page - 1);
  const endPage =
    page === 1 ? Math.min(totalPage, page + 2) : Math.min(totalPage, page + 1);

  const visiblePage = pageNumber.slice(startPage - 1, endPage);

  return (
    <section>
      <HeaderAdmin title="Halaman User" description="Kelola data customer" />

      <div className={style.container}>
        <div className={style.wrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataSlice.map((item) => (
                <tr key={item}>
                  <td>{item}</td>
                  <td>asdasdas</td>
                  <td>asdas</td>
                  <td>asdas</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={style.pagination}>
          <p onClick={handleClick}>
            Menampilkan {firstIndex + 1} -
            {page === totalPage ? data.length : lastIndex} dari {data.length}{" "}
            data
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
              <button key={item} className={style.pagination__btn}>
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
      </div>
    </section>
  );
};

export default UserPage;
