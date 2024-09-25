import Image from "next/image";
import styles from "./profile.module.scss";

import { Controller, useForm } from "react-hook-form";
import ButtonElement from "@/components/element/Button";
import FormControlFragment from "../FormControl";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { imageService, userService } from "@/services/auth/method";
import { FaPlus } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};
const SidebarProfile = () => {
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
      image: user?.image,
    },
  });
  const image = watch("image");
  const [hover, setHover] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  console.log(image);

  const onSubmit = async (data: { email: string; password: string }) => {
    if (user?.id) {
      try {
        const res = await userService.updateUser(user?.id, data);

        session.update({ ...session.data, user: res.data.data });
        reloadSession();
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

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
      );

      try {
        const res = await imageService.upload(formData);

        if (res.url) {
          setValue("image", res.url);
          event.target.value = "";
        }
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    }
  };

  const handleDeleteImage = async () => {
    setValue("image", "");
  };

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <aside className={styles.sidebar}>
      <p className={styles.sidebar__name}>Profile</p>

      <div
        className={styles.sidebar__logo}
        onClick={image ? handleDeleteImage : handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image
          src={!image ? "/profile.png" : image}
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
            {image ? <FaX color="#fff" /> : <FaPlus color="#fff" />}
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
    </aside>
  );
};

export default SidebarProfile;
