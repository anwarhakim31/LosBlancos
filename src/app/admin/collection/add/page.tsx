"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import HeaderPage from "@/components/element/HeaderPage";
import styles from "./add.module.scss";
import Input from "@/components/element/Input";
import { useForm } from "react-hook-form";
import { Fragment, useState } from "react";

import ButtonSubmit from "@/components/element/ButtonSubmit";
import { TypeCollection } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { collectionSevice } from "@/services/collection/method";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UploadImage from "@/components/fragments/UploadImage";

const AddCategoryPage = () => {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", image: "", description: "", slug: "" },
  });

  const { replace } = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TypeCollection) => {
    setLoading(true);

    try {
      const res = await collectionSevice.addCollection(data);

      if (res.status === 201) {
        toast.success(res.data.message);
        reset();
        replace("/admin/collection");
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <ButtonBackPage />

      <div className={styles.container}>
        <HeaderPage
          title="Halaman Tambah Koleksi"
          description="Tambah koleksi dengan memasukkan data dibawah"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.wrapper}>
            <label htmlFor="nama">Nama </label>
            <Input
              id="nama"
              type="text"
              placeholder="Masukkan Nama koleksi"
              field={{
                ...register("name", {
                  required: "Nama tidak boleh kosong",
                  maxLength: { value: 20, message: "Maksimal 20 karakter" },
                }),
              }}
            />
          </div>
          <small>{errors.name && errors.name.message}</small>
          <div className={styles.wrapper}>
            <label htmlFor="nama">Slug </label>
            <Input
              id="slug"
              type="text"
              placeholder="Masukkan Slug koleksi. Contoh: nama"
              field={{
                ...register("slug", {
                  required: "Slug tidak boleh kosong",
                  maxLength: { value: 20, message: "Maksimal 20 karakter" },
                }),
              }}
            />
          </div>
          <small>{errors.slug && errors.slug.message}</small>
          <div className={`${styles.wrapper} `}>
            <label htmlFor="image" onClick={(e) => e.preventDefault()}>
              Gambar
            </label>
            <UploadImage
              setLoading={setLoading}
              loading={loading}
              setValue={setValue}
              register={register}
            />
          </div>
          <small>{errors.image && errors.image.message}</small>
          <div className={styles.wrapper}>
            <label htmlFor="description">Deskripsi </label>

            <textarea
              placeholder="Masukkan deskripsi kategori"
              id="description"
              {...register("description", {
                required: "Deksripsi tidak boleh kosong",
                maxLength: { value: 555, message: "Maksimal 555 karakter" },
              })}
              className={styles.textarea}
              cols={30}
              rows={10}
            />
          </div>
          <small>{errors.description && errors.description.message}</small>

          <div
            style={{ width: "100px", marginLeft: "auto", marginTop: "20px" }}
          >
            <ButtonSubmit title="Simpan" loading={loading} />
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default AddCategoryPage;
