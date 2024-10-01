"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import HeaderPage from "@/components/element/HeaderPage";
import styles from "./add.module.scss";
import Input from "@/components/element/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";

import ButtonSubmit from "@/components/element/ButtonSubmit";
import { TypeCategory } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { categoryService } from "@/services/category/method";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UploadImage from "@/components/views/admin/category/UploadImage";

const AddCategoryPage = () => {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", image: "", description: "" },
  });

  const { push } = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TypeCategory) => {
    setLoading(true);

    try {
      const res = await categoryService.addCategory(data);

      if (res.status === 201) {
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

export default AddCategoryPage;
