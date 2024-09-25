"use client";

import HeaderPage from "@/components/element/HeaderPage";
import style from "./user.module.scss";
import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { ResponseError } from "@/utils/axios/response-error";
import { userService } from "@/services/user/method";
import { TypeUser } from "@/services/type.module";
import InputSearch from "@/components/element/InputSearch";
import ModalDelete from "@/components/fragments/ModalDelete";

const thead = [
  { title: "Nama Lengkap", padding: "1rem 1rem" },
  { title: "Email", padding: "1rem 1rem" },
  { title: "status", padding: "0.5rem 1rem" },
  { title: "Nomor Telepon", padding: "0.75rem 1rem" },
  { title: "Kelamin", padding: "0.5rem 1rem" },
  // { title: "alamat", padding: "0.75rem 1rem" },
  // { title: "kota", padding: "0.75rem 1rem" },
  // { title: "provinsi", padding: "0.75rem 1rem" },
  { title: "", padding: "0.75rem 0.5rem" },
];

const UserPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const lastIndex = page * limit;
  const firstIndex = lastIndex - limit;
  const dataSlice = data?.slice(firstIndex, lastIndex);
  const totalPage = Math.ceil(data?.length / limit);

  console.log(isDelete);
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

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const res = await userService.getUser();

        if (res.status === 200) {
          setData(res.data.user);
        }
      } catch (error) {
        ResponseError(error);
      }
    };

    getAllUser();
  }, []);

  return (
    <Fragment>
      <HeaderPage
        title="Halaman User"
        description="Kelola data pelanggan anda"
      />

      <div className={style.action}>
        <div className={style.action__search}>
          <InputSearch
            placeholder="Cari Nama, Email dari Pelanggan"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            id="search"
          />
        </div>
        <div className={style.action__button}>
          {/* <div style={{ width: "150px" }}>
            <ButtonClick onClick={handleClick} title="Tambah User" />
          </div> */}
        </div>
      </div>

      <div className={style.container}>
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
              {dataSlice?.map((item: TypeUser) => (
                <tr
                  key={item._id}
                  style={{
                    borderBottom: item === lastIndex ? "none" : "",
                  }}
                >
                  <td>{item.fullname}</td>
                  <td>{item.email}</td>
                  <td>{item.status}</td>
                  <td>{item.phone}</td>
                  <td>{item.jenisKelamin}</td>
                  {/* <td>{item.alamat}</td>
                  <td>{item.kota}</td>
                  <td>{item.provinsi}</td> */}
                  <td>
                    <div>
                      <button className={style.edit}>
                        <Edit width={16} height={16} />
                      </button>
                      <button className={style.trash}>
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
          <p onClick={handleClick}>
            Menampilkan {firstIndex + 1} -
            {page === totalPage ? data?.length : lastIndex} dari {data?.length}{" "}
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
      </div>
      <ModalDelete onClose={() => setIsDelete(false)} data={data} />
    </Fragment>
  );
};

export default UserPage;
