import ButtonElement from "@/components/element/Button";
import FormControlFragment from "@/components/fragments/FormControl";
import { authService } from "@/services/auth/method";
import { TypeUser } from "@/services/auth/type.module";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Fragment, useState } from "react";
import { useForm, Controller } from "react-hook-form";

const RegisterView = () => {
  const Router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TypeUser>({
    mode: "onSubmit",
    defaultValues: { fullname: "", email: "", password: "" },
  });
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const onSubmit = async (data: TypeUser) => {
    setLoading(true);

    try {
      const res = await authService.registerAccount(data);

      if (res.status === 201) {
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
          callbackUrl: "/",
        });

        if (result?.ok) {
          Router.push("/");
        }
      }
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.message
      ) {
        setError("email", {
          type: "manual",
          message: error.response.data.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          control={control}
          name="fullname"
          rules={{
            required: "Nama Lengkap tidak boleh kosong.",
            minLength: { value: 6, message: "Nama Lengkap minimal 6 karakter" },
          }}
          render={({ field: { ...field } }) => (
            <FormControlFragment
              type="text"
              placeholder=""
              name="fullname"
              id="nama lengkap"
              field={field}
              label={true}
              error={errors}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
              message:
                "Pastikan alamat email Anda benar (misal:nama@domain.com)",
            },
            required: "Email tidak boleh kosong",
          }}
          render={({ field: { ...field } }) => (
            <FormControlFragment
              type="email"
              placeholder=""
              name="email"
              id="email"
              field={field}
              label={true}
              error={errors}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password tidak boleh kosong.",
            minLength: { value: 6, message: "Password minimal 6 karakter" },
          }}
          render={({ field: { ...field } }) => (
            <FormControlFragment
              type={`${isShowPassword ? "text" : "password"}`}
              placeholder=""
              name="password"
              id="password"
              handleShowPassword={handleShowPassword}
              field={field}
              error={errors}
              label={true}
            />
          )}
        />
        <ButtonElement type="submit" title="Daftar" loading={loading} />
      </form>
    </Fragment>
  );
};

export default RegisterView;
