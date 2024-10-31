"use client";
import React, { useState } from "react";
import styles from "./account.module.scss";
import { useSession } from "next-auth/react";

import { useForm } from "react-hook-form";
import ProfileImageView from "@/components/fragments/ProfileImage";
import ToggleSwitch from "@/components/element/ToggleSwitch";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { ResponseError } from "@/utils/axios/response-error";
import { userService } from "@/services/user/method";
import { toast } from "sonner";
import ChangePasswordView from "@/components/views/profile/ChangePassword";
import ProfileMainView from "@/components/layouts/ProfileMainLayout";

const MyAccountPage = () => {
  const session = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: session?.data?.user?.image || "",
      fullname: session?.data?.user?.name || "",
      email: session?.data?.user?.email || "",
      phone: session?.data?.user?.phone || "",
      gender: session?.data?.user?.gender || "",
    },
  });

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const imageValue = watch("image");
  const gender = watch("gender");

  const setImageValue = (image: string) => setValue("image", image);

  const onSubmit = async (data: {
    fullname: string;
    email: string;
    image: string;
    phone: string;
    gender: string;
  }) => {
    try {
      const res = await userService.updateUser(
        session?.data?.user?.id as string,
        data
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        session.update({ ...session.data, user: res.data.data });
        setIsEdit(false);
      }
    } catch (error) {
      ResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(session);

  return (
    <ProfileMainView>
      <div className={styles.info}>
        <h3>Akun dan Keamanan</h3>
        <p>
          Atur informasi profil Anda untuk mengontrol, melindungi, dan
          mengamankan akun Anda.
        </p>
        <div className={styles.grid}>
          <div
            className={styles.photo}
            style={{ pointerEvents: isEdit ? "auto" : "none" }}
          >
            <ProfileImageView
              loading={loading}
              imageValue={imageValue}
              setLoading={setLoading}
              setValue={setImageValue}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.action}>
              <label htmlFor="profile">Ganti Profil</label>
              <ToggleSwitch
                checked={isEdit}
                handleCheck={() => setIsEdit(!isEdit)}
                id="profile"
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.control}>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  disabled={true}
                  readOnly
                  id="email"
                  {...register("email", {
                    required: "Email harus diisi",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email tidak valid",
                    },
                  })}
                  style={{ backgroundColor: "#f2f2f2" }}
                />
              </div>
              <small className={styles.error}>{errors?.email?.message}</small>
              <div className={styles.control}>
                <label htmlFor="fullname">Nama Lengkap</label>
                <input
                  type="text"
                  id="fullname"
                  className={isEdit ? styles.active : ""}
                  disabled={!isEdit}
                  readOnly={!isEdit}
                  {...register("fullname", {
                    required: "Nama Lengkap tidak boleh kosong.",
                    minLength: {
                      value: 6,
                      message: "Nama Lengkap minimal 6 karakter",
                    },
                  })}
                />
              </div>
              <small className={styles.error}>
                {errors?.fullname?.message}
              </small>
              <div className={styles.control}>
                <label htmlFor="gender">Jenis Kelamin</label>
                <select
                  id="gender"
                  className={`${isEdit ? styles.active : ""} ${
                    gender ? styles.show : ""
                  }`}
                  disabled={!isEdit}
                  {...register("gender", {
                    required: "Jenis kelamin harus diisi",
                  })}
                >
                  {loading ? (
                    <option value=""></option>
                  ) : (
                    <>
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="laki-laki">Laki-Laki</option>
                      <option value="perempuan">Perempuan</option>
                    </>
                  )}
                </select>
                {!isEdit && <div className={styles.divider}></div>}
              </div>
              <small className={styles.error}>{errors?.gender?.message}</small>
              <div className={styles.control}>
                <label htmlFor="phone">No. Telepon</label>
                <input
                  type="number"
                  id="phone"
                  className={isEdit ? styles.active : ""}
                  disabled={!isEdit}
                  readOnly={!isEdit}
                  {...register("phone", {
                    required: "Nomer Telepon harus diisi",
                  })}
                />
              </div>
              <small className={styles.error}>{errors?.phone?.message}</small>

              {isEdit && (
                <div
                  style={{
                    width: "150px",
                    marginLeft: "auto",

                    marginBottom: "20px",
                  }}
                >
                  <ButtonSubmit title="Simpan" loading={loading} />
                </div>
              )}
            </form>
            <div className={styles.action}>
              <label htmlFor="cp">Ganti Password</label>
              <ToggleSwitch
                checked={isPassword}
                handleCheck={() => setIsPassword(!isPassword)}
                id="cp"
              />
            </div>
            {isPassword && <ChangePasswordView setIsPassword={setIsPassword} />}
          </div>
        </div>
      </div>
    </ProfileMainView>
  );
};

export default MyAccountPage;
