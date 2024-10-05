"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import { useAppSelector } from "@/store/hook";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./edit.module.scss";
import HeaderPage from "@/components/element/HeaderPage";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import UploadImage from "@/components/fragments/UploadImage";
import Input from "@/components/element/Input";
import { toast } from "sonner";
import { ResponseError } from "@/utils/axios/response-error";
import { collectionSevice } from "@/services/collection/method";
import { TypeCollection } from "@/services/type.module";
import { useForm } from "react-hook-form";

const EditCategoryPage = () => {
  const { replace } = useRouter();
  const params = useSearchParams();
  const dataEdit = useAppSelector((state) => state.action.dataEdit);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", image: "", description: "", slug: "" },
  });

  const id = params?.get("id") || "";

  const image = watch("image");

  useEffect(() => {
    if (!id || (!dataEdit?.description && !dataEdit?.name)) {
      replace("/admin/collection");
    } else {
      setValue("name", dataEdit?.name);
      setValue("description", dataEdit?.description);
      setValue("image", dataEdit?.image);
      setValue("slug", dataEdit?.slug);
    }
  }, [id, dataEdit, replace, setValue]);

  const { push } = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TypeCollection) => {
    setLoading(true);

    try {
      const res = await collectionSevice.editCollection(id, data);

      if (res.status === 200) {
        toast.success(res.data.message);
        reset();
        push("/admin/collection");
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
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
              placeholder="Masukkan Nama Koleksi"
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
              image={image}
            />
          </div>
          <small>{errors.image && errors.image.message}</small>
          <div className={styles.wrapper}>
            <label htmlFor="nama">Deskripsi </label>

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
    </section>
  );
};

export default EditCategoryPage;
