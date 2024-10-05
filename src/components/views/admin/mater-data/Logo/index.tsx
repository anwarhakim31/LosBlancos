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
import { useMasterContext } from "@/context/MasterContext";
import { masterService } from "@/services/master/method";

const LogoView = () => {
  const context = useMasterContext();
  const [formData, setFormData] = useState({
    logo: "",
    name: "",
    color: "",
    favicon: "",
  });

  const [loading, setLoading] = useState(false);
  const [logoDisplay, setLogoDisplay] = useState(
    context?.master.displayLogo || false
  );
  const [displayName, setDisplayName] = useState(
    context?.master.displayName || false
  );

  const handleChange = async (data: boolean, name: string) => {
    const newCheck = !data;

    try {
      const res = await masterService.editMain({ [name]: newCheck });

      if (res.status === 200) {
        name === "displayLogo"
          ? setLogoDisplay(!logoDisplay)
          : setDisplayName(!displayName);
        toast.success(res.data.message);
        context?.handleUpdate(res.data.data);
      }
    } catch (error) {
      ResponseError(error);
    }
  };

  const handleUploadLogo = async (file: File) => {
    if (!ALLOW_IMAGE_TYPE.includes(file.type)) {
      return toast.error("Format file tidak didukung");
    }

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Ukuran file terlalu besar");
    }

    if (file) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_PRESET!);

      const originalFileName = file.name.split(".")[0];
      formData.append("public_id", originalFileName);
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

    const data = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v !== "")
    );
    try {
      const res = await masterService.editMain(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        context?.handleUpdate(res.data.data);
        setFormData({
          logo: "",
          name: "",
          color: "",
          favicon: "",
        });
      }
    } catch (error) {
      ResponseError(error);
    }
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
              id="display_logo"
              loading={loading}
              handleCheck={() => handleChange(logoDisplay, "displayLogo")}
              checked={logoDisplay || false}
            />
          </div>
          <div className={styles.content__list__image}>
            <Image
              src={context?.master.logo || "/default.png"}
              alt="logo"
              width={150}
              height={150}
              priority
            />
          </div>
          <InputFile
            id="logo"
            onChange={(file) => handleUploadLogo(file)}
            value={formData.logo.split("/").slice(7).join("")}
          />
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
              id="display_name"
              handleCheck={() => handleChange(displayName, "displayName")}
              checked={displayName || false}
            />
          </div>
          <div className={styles.content__list__name}>
            <h1 style={{ color: context?.master.color || "black" }}>
              {context?.master.name}
            </h1>
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
              src={context?.master.favicon || "/default.png"}
              alt="logo"
              width={150}
              height={150}
              priority
            />
          </div>
          <InputFile
            id="favicon"
            onChange={(file) => handleUploadLogo(file)}
            value={formData.favicon.split("/").slice(7).join("")}
          />
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
