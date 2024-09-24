import Image from "next/image";
import styles from "./profile.module.scss";

import { Controller, useForm } from "react-hook-form";
import ButtonElement from "@/components/element/Button";
import FormControlFragment from "../FormControl";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { userService } from "@/services/auth/method";
const SidebarProfile = () => {
  const session = useSession();
  const user = session?.data?.user;

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "", fullname: "" } });

  useEffect(() => {
    setValue("email", user?.email || "");
    setValue("fullname", user?.name || "");
  }, [user, setValue]);

  const onSubmit = async (data: { email: string; password: string }) => {
    if (user?.id) {
      try {
        const res = await userService.updateUser(user?.id, data);

        console.log(res);

        session.update({ ...session.data, user: res.data.data });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <aside className={styles.sidebar}>
      <p className={styles.sidebar__name}>Profile</p>

      <div className={styles.sidebar__logo}>
        <Image
          src={"/profile.png"}
          alt="image"
          width={75}
          height={75}
          priority
        />
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
                type="password"
                placeholder="* * * * * * * * *"
                name="password"
                id="password"
                field={field}
                label={false}
                error={errors}
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
