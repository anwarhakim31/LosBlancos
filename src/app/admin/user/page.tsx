"use client";

import HeaderPage from "@/components/element/HeaderPage";
import style from "./user.module.scss";

import { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";
import { ResponseError } from "@/utils/axios/response-error";
import { userService } from "@/services/user/method";
import { TypeUser } from "@/services/type.module";
import InputSearch from "@/components/element/InputSearch";
import ModalOneDelete from "@/components/fragments/ModalOneDelete";
import Table from "@/components/fragments/Table";
import { useSearchParams } from "next/navigation";
import ModalManyDelete from "@/components/fragments/ModalManyDelete";
import ModalEdit from "@/components/views/admin/user/ModalEdit";

const UserPage = () => {
  const query = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(query.get("search") || "");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPage: 0,
  });

  const [data, setData] = useState(null);

  const [isDeleteOne, setIsDeleteOne] = useState<TypeUser | null>(null);
  const [isDeleteMany, setIsDeleteMany] = useState(false);
  const [isEditData, setIsEditData] = useState<TypeUser | null>(null);
  const [check, setCheck] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const search = query.get("search");
  const page = query.get("page") && parseInt(query.get("page") as string);

  const limit = query.get("limit") && parseInt(query.get("limit") as string);

  const getAllUser = useCallback(async () => {
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
  }, [search, page, limit]);

  useEffect(() => {
    getAllUser();
  }, [page, limit, search, getAllUser]);

  const tbody: string[] = [
    "fullname",
    "email",
    "status",
    "phone",
    "jenisKelamin",
    "createdAt",
  ];

  const thead = [
    { title: "Nama Lengkap", padding: "1rem 1rem" },
    { title: "Email", padding: "1rem 1rem" },
    {
      title: "status data",
      padding: "0.5rem 1rem",
      textAlign: "center" as const,
    },
    { title: "Nomor Telepon", padding: "0.75rem 1rem" },
    { title: "Kelamin", padding: "0.5rem 1rem" },
    {
      title: "Daftar",
      padding: "0.5rem 1rem",
      textAlign: "center" as const,
    },
    { title: "", padding: "0.75rem 0.5rem" },
  ];

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Fragment>
      <HeaderPage
        title="Halaman User"
        description="Kelola data pelanggan anda"
      />

      <div className={style.action}>
        <p>
          Semua User <span>({pagination.total})</span>
        </p>
        <div className={style.action__search}>
          <InputSearch
            placeholder="Cari Nama Lengkap atau Email dari Pelanggan"
            name="search"
            onChange={handleSearch}
            value={searchQuery}
            loading={loading}
            id="search"
          />
        </div>
      </div>

      <Table
        thead={thead}
        data={data}
        setIsDeleteOne={setIsDeleteOne}
        setIsDeleteMany={setIsDeleteMany}
        setIsEditData={setIsEditData}
        tbody={tbody}
        pagination={pagination}
        loading={loading}
        setCheck={setCheck}
        check={check}
      />
      {isDeleteMany && (
        <ModalManyDelete
          setCheck={setCheck}
          onClose={() => setIsDeleteMany(false)}
          title="Apakah anda yakin ingin menghapus data terpilih ?"
          fetching={() => userService.deleteMany(check)}
          callback={() => getAllUser()}
        />
      )}

      {isDeleteOne && (
        <ModalOneDelete
          onClose={() => setIsDeleteOne(null)}
          fetching={() => userService.deleteOne(isDeleteOne?._id as string)}
          title={"Apakah anda yakin ingin menghapus user ini ?"}
          callback={() => getAllUser()}
        />
      )}
      {isEditData && (
        <ModalEdit
          onClose={() => setIsEditData(null)}
          isEditData={isEditData}
          callback={() => getAllUser()}
        />
      )}
    </Fragment>
  );
};

export default UserPage;
