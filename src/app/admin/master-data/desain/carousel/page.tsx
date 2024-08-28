"use client";
import HeaderPage from "@/components/element/HeaderPage";
import Input from "@/components/element/Input";
import { useSearchParams } from "next/navigation";
import styles from "./manage.module.scss";
import { useForm } from "react-hook-form";
import UploadImage from "@/components/fragments/UploadImage";
import { useState } from "react";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { ResponseError } from "@/utils/axios/response-error";
import { TypeCarousel } from "@/services/type.module";

const ManageCarousel = () => {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: "",
      title: "",
      url: "",
      caption: "",
      description: "",
    },
  });
  const image = watch("image");
  const [loading, setLoading] = useState(false);

  console.log(id);

  const onSubmit = async (data: TypeCarousel) => {
    console.log(data);
    try {
    } catch (error) {
      ResponseError(error);
    }
  };

  return (
    <div className={styles.container}>
      <HeaderPage
        title="Halaman Kelola Carousel"
        description={"Kelola Carousel dengan mengisi informasi di bawah ini"}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapper}>
          <label htmlFor="image">Image </label>
          <UploadImage
            setLoading={setLoading}
            register={register}
            image={image}
            loading={loading}
            setValue={setValue}
          />
        </div>
        <small>{errors.image && errors.image.message}</small>
        <div className={styles.wrapper}>
          <label htmlFor="title">Title</label>
          <Input
            id="title"
            type="text"
            placeholder="Masukkan Title"
            field={{
              ...register("title", {
                required: "Title tidak boleh kosong",
                maxLength: { value: 20, message: "Maksimal 20 karakter" },
              }),
            }}
          />
        </div>
        <small>{errors.title && errors.title.message}</small>
        <div className={styles.wrapper}>
          <label htmlFor="url">Target URL </label>
          <Input
            id="url"
            type="text"
            placeholder="Masukkan Target URL"
            field={{
              ...register("url", {
                required: "Target URL tidak boleh kosong",
                maxLength: { value: 20, message: "Maksimal 20 karakter" },
              }),
            }}
          />
        </div>
        <small>{errors.url && errors.url.message}</small>
        <div className={styles.wrapper}>
          <label htmlFor="desription">Deskripsi</label>
          <textarea
            id="desription"
            placeholder="Masukkan Deskripsi"
            {...register("description", {
              required: "Deskripsi tidak boleh kosong",
              maxLength: { value: 20, message: "Maksimal 20 karakter" },
            })}
            className={styles.textarea}
            cols={30}
            rows={10}
          />
        </div>
        <small>{errors.description && errors.description.message}</small>
        <div className={styles.button}>
          <ButtonSubmit title="Simpan" loading={loading} />
        </div>
      </form>
    </div>
  );
};

export default ManageCarousel;
