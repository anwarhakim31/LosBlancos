"use client";
import ButtonBackPage from "@/components/element/ButtonBackPage";
import HeaderPage from "@/components/element/HeaderPage";
import styles from "./add.module.scss";
import Input from "@/components/element/Input";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import Cloud from "@/assets/cloud.svg";
import { ArrowUp, Image as LucideImage, X } from "lucide-react";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { TypeCategory } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { categoryService } from "@/services/category/method";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { imageService } from "@/services/image/method";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
  const [preview, setPreview] = useState("");
  const [files, setFiles] = useState<File>({} as File);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleImageCLick = () => {
    inputRef.current?.click();
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFiles(file as File);

    if (file) {
      setLoadingImage(true);
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const eventSource = new EventSource("/api/progress");

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const { loaded, total } = data;
            const progress = Math.round((loaded / total) * 100);

            setProgress(progress);
          } catch (error) {
            console.error("Error parsing event data:", error);
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
        };

        const res = await imageService.upload(formData);

        eventSource.close();

        if (res.status === 200) {
          setPreview(res.data.image);
          setValue;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
        setLoadingImage(false);
        setProgress(0);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }
  };

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

  const handleImageDelete = async () => {
    setPreview("");
    setValue("image", "");

    try {
      await imageService.delete(preview);
    } catch (error) {
      ResponseError(error);
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
            <div
              tabIndex={0}
              className={`${styles.wrapper__image}`}
              style={{ cursor: preview ? "auto" : "pointer" }}
              onClick={
                loading ? () => {} : preview ? () => {} : handleImageCLick
              }
            >
              {!preview && progress === 0 && !loadingImage && (
                <div className={styles.upload}>
                  <div className={styles.upload__icon}>
                    <Cloud width={100} height={100} strokeWidth={1} />
                    <div className={styles.upload__icon__top}>
                      <ArrowUp />
                    </div>
                  </div>
                  <h5>Pilih Gambar untuk diunggah</h5>
                  <p>atau tarik dan seret gambar ke sini</p>
                  <span>Format file PNG, JPG, JPEG dan WEBP</span>
                </div>
              )}
              {loadingImage && (
                <div className={styles.progress}>
                  <div className={styles.detail}>
                    <LucideImage width={22} height={22} strokeWidth={1} />{" "}
                    <p>{files && files.name}</p>
                  </div>
                  <div className={styles.progress__bar}>
                    <div
                      className={styles.progress__bar__progress}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {preview && (
                <div className={styles.preview}>
                  <div className={styles.detail}>
                    <span>{preview.split("#-#").pop()}</span>
                    <button type="button" onClick={handleImageDelete}>
                      <X width={16} height={16} />
                    </button>
                  </div>
                </div>
              )}
              <input
                type="text"
                id="file"
                style={{ display: "none" }}
                {...register("image", {
                  required: "Gambar tidak boleh kosong",
                })}
              />
              <input
                type="file"
                id="image"
                name="image"
                style={{ display: "none" }}
                ref={inputRef}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
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
