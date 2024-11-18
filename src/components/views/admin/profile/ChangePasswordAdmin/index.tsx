import ButtonSubmit from "@/components/element/ButtonSubmit";
import FormControlProfile from "@/components/fragments/FormControlProfile";
import { userService } from "@/services/user/method";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import styles from "./cp.module.scss";
import ToggleSwitch from "@/components/element/ToggleSwitch";

const ChangePasswordAdminView = ({
  setIsPassword,
  isPassword,
}: {
  setIsPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isPassword: boolean;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    control,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [loading, setLoading] = React.useState(false);
  const session = useSession();

  const newPassword = watch("newPassword");

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
    <>
      <div className={styles.wrapper}>
        <label htmlFor="password"> Ganti Password</label>
        <ToggleSwitch
          checked={isPassword}
          handleCheck={() => setIsPassword(!isPassword)}
          id="Ganti Password"
          loading={loading}
        />
      </div>
      {isPassword && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="oldPassword"
            control={control}
            rules={{
              required: "Password lama tidak boleh kosong",
            }}
            render={({ field }) => (
              <FormControlProfile
                type="password"
                name="Password Lama"
                id="oldPassword"
                placeholder=""
                field={field}
                errors={errors}
                isEdit
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: "Password Baru tidak boleh kosong",
              minLength: {
                value: 6,
                message: "Password minimal 6 karakter",
              },
            }}
            render={({ field }) => (
              <FormControlProfile
                type="password"
                name="Password Baru"
                id="newPassword"
                placeholder=""
                field={field}
                errors={errors}
                isEdit
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              validate: (value) =>
                value === newPassword || "Password tidak sama",
              required: "Konfirmasi Password tidak boleh kosong",
            }}
            render={({ field }) => (
              <FormControlProfile
                type="password"
                name="Konfirmasi Password"
                id="confirmPassword"
                placeholder=""
                field={field}
                errors={errors}
                isEdit
              />
            )}
          />
          <div style={{ width: "200px" }}>
            <ButtonSubmit title="Simpan" loading={loading} />
          </div>
        </form>
      )}
    </>
  );
};

export default ChangePasswordAdminView;
