"use client";

import styles from "./profile.module.scss";

import { Controller, useForm } from "react-hook-form";

import { useSession } from "next-auth/react";
import React, { useState } from "react";

import HeaderPage from "@/components/element/HeaderPage";

import FormControlProfile from "@/components/fragments/FormControlProfile";
import ButtonSubmit from "@/components/element/ButtonSubmit";

import { toast } from "sonner";
import ProfileImageView from "@/components/fragments/ProfileImage";
import ToggleSwitch from "@/components/element/ToggleSwitch";
import ChangePasswordAdminView from "@/components/views/admin/profile/ChangePasswordAdmin";
import { userService } from "@/services/user/method";

const ProfileAdminPage = () => {
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);

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

  return (
    <section>
      <HeaderPage
        title="Profile"
        description="Atur informasi profil Anda untuk mengontrol, melindungi, dan
          mengamankan akun Anda."
      />
      <div className={styles.profile}>
        <div className={styles.profile__head}>
          <div className={styles.profile__head__wrapper}>
            <ToggleSwitch
              checked={isEdit}
              handleCheck={() => setIsEdit(!isEdit)}
              id="profile"
              loading={isLoading}
            />
            <label htmlFor="profile">Ganti Profil</label>
          </div>
          <div
            className={
              styles.profile__head__wrapper +
              " " +
              styles.profile__head__wrapper__password
            }
          >
            <ToggleSwitch
              checked={isPassword}
              handleCheck={() => setIsPassword(!isPassword)}
              id="password"
              loading={isLoading}
            />
            <label htmlFor="profile">Ganti Password</label>
          </div>
        </div>
        <div className={styles.profile__content}>
          <div className={styles.profile__content__left}>
            <div
              className={styles.profile__image__wrapper}
              style={{ pointerEvents: isEdit ? "unset" : "none" }}
            >
              <ProfileImageView
                imageValue={image}
                setValue={() => setValue("image", "")}
                loading={isLoading}
                setLoading={setIsLoading}
              />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className={styles.sidebar__form}
            >
              <div style={{ width: "100%" }}>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email tidak boleh kosong.",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
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
                      isEdit={false}
                      errors={errors}
                    />
                  )}
                />
              </div>
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

              <div className={styles.button}>
                {isEdit && <ButtonSubmit title="Simpan" loading={isLoading} />}
              </div>
            </form>
          </div>

          <div className={styles.profile__content__right}>
            <ChangePasswordAdminView
              isPassword={isPassword}
              setIsPassword={setIsPassword}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileAdminPage;
