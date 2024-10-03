/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import HeaderPage from "@/components/element/HeaderPage";
import Input from "@/components/element/Input";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./manage.module.scss";
import { useForm } from "react-hook-form";
import UploadImage from "@/components/fragments/UploadImage";
import { Fragment, useEffect, useState } from "react";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { ResponseError } from "@/utils/axios/response-error";
import { TypeCarousel } from "@/services/type.module";
import { masterService } from "@/services/master/method";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hook";
import ButtonBackPage from "@/components/element/ButtonBackPage";

const ManageCarousel = () => {
  const { replace } = useRouter();
  const params = useSearchParams();
  const id = params.get("id") || "";
  const dataEdit = useAppSelector((state) => state.action.editCarousel);
  const {
    register,
    reset,
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

  useEffect(() => {
    if (dataEdit && id) {
      setValue("caption", dataEdit.caption);
      setValue("description", dataEdit.description);
      setValue("image", dataEdit.image);
      setValue("title", dataEdit.title);
      setValue("url", dataEdit.url);
    } else if (!dataEdit && id) {
      replace("/admin/master-data/desain");
    }
  }, [id, dataEdit, replace, setValue]);

  console.log(dataEdit);

  const onSubmit = async (data: TypeCarousel) => {
    setLoading(true);

    if (dataEdit && id) {
      try {
        const res = await masterService.editCarousel(id, data);
        if (res.status === 200) {
          toast.success(res.data.message);
          replace("/admin/master-data/desain");
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
        reset();
      }
    } else {
      try {
        const res = await masterService.addCarousel(data);

        if (res.status === 201) {
          toast.success(res.data.message);
          replace("/admin/master-data/desain");
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
        reset();
      }
    }
  };

  return (
    <Fragment>
      <ButtonBackPage />
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
                  maxLength: { value: 24, message: "Maksimal 24 karakter" },
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
                }),
              }}
            />
          </div>

          <small>{errors.url && errors.url.message}</small>
          <div className={styles.wrapper}>
            <label htmlFor="caption">Caption </label>
            <Input
              id="caption"
              type="text"
              placeholder="Masukkan Caption"
              field={{
                ...register("caption", {
                  required: "Caption tidak boleh kosong",
                  maxLength: { value: 24, message: "Maksimal 24 karakter" },
                }),
              }}
            />
          </div>
          <small>{errors.caption && errors.caption.message}</small>
          <div className={styles.wrapper}>
            <label htmlFor="desription">Deskripsi</label>
            <textarea
              id="desription"
              placeholder="Masukkan Deskripsi"
              {...register("description", {
                required: "Deskripsi tidak boleh kosong",
                maxLength: { value: 112, message: "Maksimal 112 karakter" },
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
    </Fragment>
  );
};

export default ManageCarousel;
