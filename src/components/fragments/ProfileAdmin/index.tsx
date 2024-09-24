import Image from "next/image";
import styles from "./profile.module.scss";

import { Controller, useForm } from "react-hook-form";
import ButtonElement from "@/components/element/Button";
import FormControlFragment from "../FormControl";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
const SidebarProfile = () => {
  const session = useSession();
  const user = session?.data?.user;

  const {
    handleSubmit,
    control,

    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  useEffect(() => {
    if (user) {
      setValue("email", user?.email || "");
    }
  }, [user, setValue]);

  return (
    <aside className={styles.sidebar}>
      <p className={styles.sidebar__name}>Profile</p>

      <div className={styles.sidebar__logo}>
        <Image src={"/profile.png"} alt="image" width={75} height={75} />
      </div>
      <h3 className={styles.sidebar__foto}>Foto</h3>

      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        noValidate
        className={styles.sidebar__form}
      >
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
                type="passwod"
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
