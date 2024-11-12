import React, { useState } from "react";
import styles from "./cp.module.scss";
import { useForm } from "react-hook-form";
import ButtonSubmit from "@/components/element/ButtonSubmit";
import { userService } from "@/services/user/method";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AxiosError } from "axios";

const ChangePasswordView = ({
  setIsPassword,
}: {
  setIsPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const session = useSession();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: {
    newPassword: string;
    oldPassword: string;
    confirmPassword: string;
  }) => {
    setLoading(true);

    try {
      const res = await userService.changePsw(
        session?.data?.user?.id as string,
        data.oldPassword,
        data.newPassword
      );

      if (res.status === 200) {
        toast.success("Berhasil mengganti password");
        setLoading(false);
        setIsPassword(false);
      }
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.message
      ) {
        setError("oldPassword", { message: error.response.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <span className={styles.note}>
        *Jika daftar dengan google, password berisi seperti nama lengkap anda
      </span>
      <div className={styles.control}>
        <label htmlFor="oldPassword">Password lama</label>
        <input
          type="password"
          id="oldPassword"
          {...register("oldPassword", {
            required: "Password lama tidak boleh kosong",
          })}
        />
      </div>
      <small className={styles.error}>{errors.oldPassword?.message}</small>
      <div className={styles.control}>
        <label htmlFor="newPassword">Password Baru</label>
        <input
          type="password"
          id="newPassword"
          {...register("newPassword", {
            required: "Password baru tidak boleh kosong",
            minLength: { value: 6, message: "Password minimal 6 karakter" },
          })}
        />
      </div>
      <small className={styles.error}>{errors.newPassword?.message}</small>
      <div className={styles.control}>
        <label htmlFor="confirm">Konfirm Password</label>
        <input
          type="password"
          id="confirm"
          {...register("confirmPassword", {
            required: "Konfirmasi password tidak boleh kosong",
            validate: (value) =>
              value === watch("newPassword") ||
              "Konfirmasi Password tidak sama",
          })}
        />
      </div>
      <small className={styles.error}>{errors.confirmPassword?.message}</small>
      <div
        style={{
          width: "150px",
          marginLeft: "auto",

          marginBottom: "20px",
        }}
      >
        <ButtonSubmit title="Simpan" loading={loading} />
      </div>
    </form>
  );
};

export default ChangePasswordView;
