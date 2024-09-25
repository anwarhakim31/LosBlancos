"use client";

import Image from "next/image";
import styles from "./profile.module.scss";

import { Controller, useForm } from "react-hook-form";

import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { imageService, userService } from "@/services/user/method";

import { Plus, X } from "lucide-react";
import { ALLOW_IMAGE_TYPE } from "@/utils/AllowImageType";
import HeaderPage from "@/components/element/HeaderPage";
import ImageFormat from "@/components/element/ImageFormat";
import ErrorBadge from "@/components/element/ErrorBadge";

import FormControlProfile from "@/components/fragments/FormControlProfile";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import ButtonClick from "@/components/element/ButtonClick";
import { toast } from "sonner";

const ProfileAdminPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const session = useSession();
  const user = session?.data?.user;

  const {
    handleSubmit,
    control,
    setValue,

    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      password: "",
      fullname: user?.name || "",
      image: user?.image || "",
    },
  });

  const image = watch("image");

  const [hover, setHover] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");
  const [preset, setPreset] = useState<string | null>(user?.image || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    if (user?.id) {
      setIsLoading(true);
      try {
        const res = await userService.updateUser(user?.id, data);

        if (res.status === 200) {
          session.update({ ...session.data, user: res.data.data });
          setIsEdit(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChangeImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!ALLOW_IMAGE_TYPE.includes(file?.type || "")) {
      return setIsError("Format file tidak didukung.");
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);
      try {
        const res = await imageService.uploadUser(formData);

        if (res.status === 200) {
          setPreset(res.data.url);
          setValue("image", res.data.url);
          event.target.value = "";
          setIsError("");
        }
      } catch (error) {
        setIsError("Gagal mengupload gambar.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await imageService.deleteUser({ filename: image });

      if (res.status === 200) {
        setPreset("");
        setValue("image", "");
        setIsError("");
      }
    } catch (error) {
      setIsError("Gagal menghapus gambar.");
    }

    setPreset("");
  };

  return (
    <section>
      <HeaderPage
        title="Profile"
        description="Atur informasi profil Anda untuk mengontrol, melindungi, dan
          mengamankan akun Anda."
      />
      <div className={styles.profile}>
        <div className={styles.profile__image__wrapper}>
          <div
            className={styles.profile__image}
            onClick={
              isEdit ? (preset ? handleDeleteImage : handleClick) : undefined
            }
            onMouseEnter={() => isEdit && setHover(true)}
            onMouseLeave={() => isEdit && setHover(false)}
            style={{
              cursor: isEdit ? "pointer" : "default",
            }}
          >
            <Image
              src={!preset ? "/profile.png" : preset}
              alt="image"
              width={1000}
              height={1000}
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChangeImage}
            />
            {hover && (
              <div className={styles.profile__image__overlay}>
                {preset ? (
                  <X width={30} height={30} color="#fff" />
                ) : (
                  <Plus width={30} height={30} color="#fff" />
                )}
              </div>
            )}
          </div>
          <ImageFormat />
          <ErrorBadge isError={isError} />
        </div>
        <div className={` ${styles.profile__content}`}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className={styles.sidebar__form}
          >
            <div style={{ width: "100%" }}>
              <Controller
                control={control}
                name="fullname"
                rules={{
                  required: "Nama Lengkap tidak boleh kosong.",
                  minLength: {
                    value: 6,
                    message: "Nama Lengkap minimal 6 karakter.",
                  },
                }}
                render={({ field }) => (
                  <FormControlProfile
                    type="text"
                    placeholder="John Doe"
                    name="Nama Panjang"
                    id="fullname"
                    field={field}
                    isEdit={isEdit}
                    errors={errors}
                  />
                )}
              />
            </div>

            <div style={{ width: "100%" }}>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email tidak boleh kosong.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                    message:
                      "Pastikan alamat email Anda benar (misal:nama@domain.com)",
                  },
                }}
                render={({ field }) => (
                  <FormControlProfile
                    type="email"
                    placeholder="example@domain.com"
                    name="email"
                    id="email"
                    field={field}
                    isEdit={isEdit}
                    errors={errors}
                  />
                )}
              />
            </div>
            <div style={{ width: "100%" }}>
              <Controller
                control={control}
                name="password"
                rules={{
                  minLength: {
                    value: 6,
                    message: "Password minimal 6 karakter",
                  },
                }}
                render={({ field }) => (
                  <FormControlProfile
                    type="password"
                    placeholder="* * * * * * * * *"
                    name="password"
                    id="password"
                    field={field}
                    errors={errors}
                    isEdit={isEdit}
                  />
                )}
              />
            </div>
            <div className={styles.profile__form__button}>
              {isEdit ? (
                <ButtonSubmit title="Simpan" loading={isLoading} />
              ) : (
                <ButtonClick
                  title="Edit Profile"
                  onClick={() => setIsEdit(true)}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProfileAdminPage;
