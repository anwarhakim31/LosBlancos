"use client";

import HeaderPage from "@/components/element/HeaderPage";
import style from "./user.module.scss";

import { Fragment, useEffect, useState } from "react";
import { ResponseError } from "@/utils/axios/response-error";
import { userService } from "@/services/user/method";
import { TypeUser } from "@/services/type.module";
import InputSearch from "@/components/element/InputSearch";
import ModalOneDelete from "@/components/fragments/ModalOneDelete";
import { toast } from "sonner";
import Table from "@/components/fragments/Table";
import { useSearchParams } from "next/navigation";

const UserPage = () => {
  const query = useSearchParams();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPage: 0,
  });

  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [isDeleteOne, setIsDeleteOne] = useState<TypeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const page = query.get("page")
    ? parseInt(query.get("page") as string)
    : pagination.page;
  const limit = query.get("limit")
    ? parseInt(query.get("limit") as string)
    : pagination.limit;

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const params = { page, limit, search };
        const res = await userService.getUser(params);

        if (res.status === 200) {
          setData(res.data.user);
          setPagination(res.data.pagination);
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    getAllUser();
  }, [page, limit, isDeleteOne, search]);

  const handleDelete = async () => {
    try {
      const res = await userService.deleteUser(isDeleteOne?._id);

      if (res.status === 200) {
        toast.success(res.data.message);
        setIsDeleteOne(null);
      }
    } catch (error) {
      ResponseError(error);
    }
  };

  const tbody: string[] = [
    "fullname",
    "email",
    "status",
    "phone",
    "jenisKelamin",
  ];

  const thead = [
    { title: "Nama Lengkap", padding: "1rem 1rem" },
    { title: "Email", padding: "1rem 1rem" },
    { title: "status", padding: "0.5rem 1rem" },
    { title: "Nomor Telepon", padding: "0.75rem 1rem" },
    { title: "Kelamin", padding: "0.5rem 1rem" },

    { title: "", padding: "0.75rem 0.5rem" },
  ];

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
        <div className={style.action__button}></div>
      </div>

      <Table
        thead={thead}
        data={data}
        setIsDeleteOne={setIsDeleteOne}
        tbody={tbody}
        pagination={pagination}
        loading={loading}
      />
      {isDeleteOne && (
        <ModalOneDelete
          onClose={() => setIsDeleteOne(null)}
          handleDelete={handleDelete}
          title={"Apakah anda yakin ingin menghapus user ini ?"}
        />
      )}
    </Fragment>
  );
};

export default UserPage;
