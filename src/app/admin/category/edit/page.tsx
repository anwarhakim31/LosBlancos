"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import { useAppSelector } from "@/store/hook";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./edit.module.scss";
import HeaderPage from "@/components/element/HeaderPage";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import UploadImage from "@/components/views/admin/category/UploadImage";
import Input from "@/components/element/Input";
import { toast } from "sonner";
import { ResponseError } from "@/utils/axios/response-error";
import { categoryService } from "@/services/category/method";
import { TypeCategory } from "@/services/type.module";
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
    defaultValues: { name: "", image: "", description: "" },
  });

  const id = params?.get("id") || "";

  const image = watch("image");

  useEffect(() => {
    if (!id || (!dataEdit?.description && !dataEdit?.name)) {
      replace("/admin/category");
    } else {
      setValue("name", dataEdit?.name);
      setValue("description", dataEdit?.description);
      setValue("image", dataEdit?.image);
    }
  }, [id, dataEdit, replace, setValue]);

  const { push } = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TypeCategory) => {
    setLoading(true);

    try {
      const res = await categoryService.editCategory(id, data);

      if (res.status === 200) {
        toast.success(res.data.message);
        reset();
        push("/admin/category");
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
          title="Halaman Tambah Kategori"
          description="Tambah kategori dengan memasukkan data dibawah"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.wrapper}>
            <label htmlFor="nama">Nama </label>
            <Input
              id="nama"
              type="text"
              placeholder="Masukkan Nama Kategori"
              field={{
                ...register("name", {
                  required: "Nama tidak boleh kosong",
                  maxLength: { value: 20, message: "Maksimal 20 karakter" },
                }),
              }}
            />
          </div>
          <small>{errors.name && errors.name.message}</small>
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
                maxLength: { value: 255, message: "Maksimal 255 karakter" },
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
