"use client";

import Image from "next/image";
import styles from "./profile.module.scss";

import { Controller, useForm } from "react-hook-form";
import ButtonElement from "@/components/element/Button";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { imageService, userService } from "@/services/auth/method";

import FormControlFragment from "@/components/fragments/FormControl";
import { Plus, X } from "lucide-react";
import { ALLOW_IMAGE_TYPE } from "@/utils/AllowImageType";

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
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [preset, setPreset] = useState<string | null>(user?.image || null);

  const onSubmit = async (data: { email: string; password: string }) => {
    if (user?.id) {
      try {
        const res = await userService.updateUser(user?.id, data);

        session.update({ ...session.data, user: res.data.data });
      } catch (error) {
        console.log(error);
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
      return console.log("gagal");
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await imageService.uploadUser(formData);

        if (res.status === 200) {
          setPreset(res.data.url);
          setValue("image", res.data.url);
          event.target.value = "";
        }
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await imageService.deleteUser({ filename: image });

      if (res.status === 200) {
        setPreset("");
        setValue("image", "");
      }
    } catch (error) {
      console.error("Error uploading the image:", error);
    }

    setPreset("");
  };

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <section className={styles.sidebar}>
      <p className={styles.sidebar__name}>Profile</p>

      <div
        className={styles.sidebar__logo}
        onClick={preset ? handleDeleteImage : handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image
          src={!preset ? "/profile.png" : preset}
          alt="image"
          width={75}
          height={75}
          priority
        />
        <input
          ref={inputRef}
          type="file"
          accept=".png, .jpg, .jpeg"
          style={{ display: "none" }}
          onChange={handleChangeImage}
        />
        {hover && (
          <div className={styles.sidebar__logo__overlay}>
            {preset ? (
              <X width={20} height={20} color="#fff" />
            ) : (
              <Plus width={20} height={20} color="#fff" />
            )}
          </div>
        )}
      </div>
      <h3 className={styles.sidebar__foto}>Foto</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.sidebar__form}
      >
        <div style={{ width: "100%" }}>
          <label htmlFor="fullname" className={styles.sidebar__form__label}>
            Nama Lengkap
          </label>
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
              <FormControlFragment
                type="text"
                placeholder="example@domain.com"
                name="fullname"
                id="fullname"
                field={field}
                label={false}
                error={errors}
              />
            )}
          />
        </div>

        <div style={{ width: "100%" }}>
          <label htmlFor="email" className={styles.sidebar__form__label}>
            Email
          </label>
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
              <FormControlFragment
                type="email"
                placeholder="example@domain.com"
                name="email"
                id="email"
                field={field}
                label={false}
                error={errors}
              />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="email" className={styles.sidebar__form__label}>
            Password
          </label>
          <Controller
            control={control}
            name="password"
            rules={{
              minLength: { value: 6, message: "Password minimal 6 karakter" },
            }}
            render={({ field }) => (
              <FormControlFragment
                type={isShowPassword ? "text" : "password"}
                placeholder="* * * * * * * * *"
                name="password"
                id="password"
                field={field}
                label={false}
                error={errors}
                handleShowPassword={handleShowPassword}
              />
            )}
          />
        </div>
        <ButtonElement type="submit" title="Simpan" />
      </form>
    </section>
  );
};

export default ProfileAdminPage;
