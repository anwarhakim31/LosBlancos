/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from "react";
import { imageService } from "@/services/image/method";
import { ALLOW_IMAGE_TYPE } from "@/utils/AllowImageType";
import { toast } from "sonner";
import Cloud from "@/assets/cloud.svg";
import { ArrowUp, Image as LucideImage, X } from "lucide-react";
import { ResponseError } from "@/utils/axios/response-error";
import styles from "./upload.module.scss";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

const UploadImage = ({
  setLoading,
  loading,
  setValue,
  register,
  image,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setValue: any;
  register: any;
  image?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [files, setFiles] = useState<File>({} as File);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const handleImageCLick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    if (image) {
      console.log(image);
      setPreview(image);
    }
  }, [image]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFiles(file as File);

    if (!ALLOW_IMAGE_TYPE.includes(file?.type || "")) {
      return toast.error("Format file tidak didukung");
    }

    if (file) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_PRESET!);

        const originalFileName = `${uuidv4()}/${file.name.split(".")[0]}`;
        formData.append("public_id", originalFileName);

        const res = await imageService.upload(formData, (percentage) => {
          setProgress(percentage);
        });

        if (res.status === 200) {
          setPreview(res.data.url);
          setProgress(100);
          setValue("image", res.data.url);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);

        setProgress(0);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }
  };

  const handleImageDelete = async () => {
    setPreview("");
    setValue("image", "");
    setDragging(false);
    try {
      await imageService.delete(preview);
    } catch (error) {
      ResponseError(error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (inputRef && inputRef.current) {
        inputRef.current.files = e.dataTransfer.files;

        inputRef.current.dispatchEvent(
          new Event("change", { bubbles: true, cancelable: true })
        );
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };
  return (
    <div
      tabIndex={0}
      className={`${styles.image} ${dragging ? styles.active : ""}`}
      style={{ cursor: preview ? "auto" : "pointer" }}
      onDragEnter={loading ? () => {} : preview ? () => {} : handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={loading ? () => {} : preview ? () => {} : handleDragOver}
      onDrop={loading ? () => {} : preview ? () => {} : handleDrop}
      onClick={loading ? () => {} : preview ? () => {} : handleImageCLick}
    >
      {!preview && progress <= 0 && (
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
      {progress > 0 && (
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
          <div className={styles.image}>
            <Image
              src={preview}
              alt="preview"
              width={500}
              height={500}
              priority
            />
          </div>
          <div className={styles.detail}>
            <span>{preview.split("/").slice(8).join("/")}</span>
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
  );
};

export default UploadImage;
