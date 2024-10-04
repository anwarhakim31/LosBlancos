"use client";
import { List } from "lucide-react";
import styles from "./logo.module.scss";
import { useState } from "react";
import Image from "next/image";
import InputFile from "@/components/element/InputFile";
import Input from "@/components/element/Input";
import ImageFormat from "@/components/element/ImageFormat";
import ToggleSwitch from "@/components/element/ToggleSwitch";
import { ResponseError } from "@/utils/axios/response-error";
import { imageService } from "@/services/image/method";
import { ALLOW_IMAGE_TYPE } from "@/utils/AllowImageType";
import { toast } from "sonner";
import ButtonSubmit from "@/components/element/ButtonSubmit";

const LogoView = () => {
  const [formData, setFormData] = useState({
    logo: "",
    name: "",
    color: "",
  });

  const [loading, setLoading] = useState(false);

  const handleUploadLogo = async (file: File) => {
    if (file && !ALLOW_IMAGE_TYPE.includes(file.type)) {
      return toast.error("Format file tidak didukung");
    }

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Ukuran file terlalu besar");
    }

    if (file) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_PRESET!);
      setLoading(true);
      try {
        const res = await imageService.upload(formData, () => {});

        if (res.status === 200) {
          setFormData((prev) => ({ ...prev, logo: res.data.url }));
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__box}>
          <div className={styles.header__title}>
            <List width={20} height={20} />
            <h5>Logo</h5>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.content__list}>
          <div className={styles.content__list__head}>
            <h5>Gambar Logo</h5>
            <ToggleSwitch
              loading={loading}
              handleCheck={() => {}}
              checked={false}
            />
          </div>
          <div className={styles.content__list__image}>
            <Image
              src={formData.logo || "/default.png"}
              alt="logo"
              width={150}
              height={150}
              priority
            />
          </div>
          <InputFile onChange={(file) => handleUploadLogo(file)} />
          <div style={{ marginTop: "10px" }} className="flex-center">
            <ImageFormat />
          </div>
          <small style={{ textAlign: "center", display: "block" }}>
            Ukuran gambar maksimal 2 MB
          </small>
        </div>
        <div className={styles.content__list}>
          <div className={styles.content__list__head}>
            <h5>Nama Logo</h5>
            <ToggleSwitch
              loading={loading}
              handleCheck={() => {}}
              checked={false}
            />
          </div>
          <div className={styles.content__list__name}>
            <h1>LosBlancos</h1>
          </div>
          <Input
            placeholder="Masukan nama toko"
            name="name"
            id="name"
            type="text"
            field={{
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value }),
              value: formData.name,
            }}
          />
          <input
            id="color"
            name="color"
            type="text"
            className={styles.content__list__color}
            placeholder="Masukan kode warna HEX"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, color: e.target.value })
            }
            value={formData.color}
            autoComplete="off"
          />
        </div>
        <div className={styles.content__list}>
          <h5>Favicon</h5>
          <div className={styles.content__list__image}>
            <Image
              src={formData.logo || "/default.png"}
              alt="logo"
              width={150}
              height={150}
              priority
            />
          </div>
          <InputFile onChange={(file) => handleUploadLogo(file)} />
          <div style={{ marginTop: "10px" }} className="flex-center">
            <ImageFormat />
          </div>
          <small style={{ textAlign: "center", display: "block" }}>
            Ukuran gambar maksimal 2 MB
          </small>
        </div>
      </div>

      <div
        style={{
          padding: "0.5rem 2rem",
          width: "150px",
          marginLeft: "auto",
          opacity: Object.values(formData).some((value) => value !== "")
            ? 1
            : 0,
          pointerEvents: Object.values(formData).some((value) => value !== "")
            ? "auto"
            : "none",
        }}
      >
        <ButtonSubmit title="Submit" loading={loading} />
      </div>
    </form>
  );
};

export default LogoView;
