"use client";

import { Controller, useForm } from "react-hook-form";
import FormControlAnimate from "@/components/fragments/FormControlAnimate";
import { Fragment, useState, FC } from "react";
import ButtonElement from "@/components/element/ButtonSubmit";
import { authService } from "@/services/auth/method";
import { useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import ErrorBadge from "@/components/element/ErrorBadge";

type TypeReset = {
  password: string;
  confirmPassword: string;
};

interface ResetViewProps {
  setSuccess: (success: boolean) => void;
}

const ResetPasswordView: FC<ResetViewProps> = ({ setSuccess }) => {
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<TypeReset>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const [isError, setIsError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const query = useSearchParams();

  const token = query.get("token");

  const password = watch("password");

  const [isShowPassword1, setIsShowPassword1] = useState<boolean>(false);
  const [isShowPassword2, setIsShowPassword2] = useState<boolean>(false);

  const onSubmit = async (data: TypeReset) => {
    setIsLoading(true);
    try {
      const res = await authService.resetPassword({
        password: data.password,
        token: token!,
      });

      if (res.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.message
      ) {
        setIsError(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassword1 = () => {
    setIsShowPassword1(!isShowPassword1);
  };
  const handlePassword2 = () => {
    setIsShowPassword2(!isShowPassword2);
  };

  return (
    <Fragment>
      <ErrorBadge isError={isError} />
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "2rem" }}>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password tidak boleh kosong",
            minLength: { value: 6, message: "Password minimal 6 karakter" },
          }}
          render={({ field: { ...field } }) => (
            <FormControlAnimate
              label={true}
              name="password"
              type={isShowPassword1 ? "text" : "password"}
              id="Password"
              field={field}
              placeholder=""
              error={errors}
              handleShowPassword={handlePassword1}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Konfirmasi Password tidak boleh kosong",
            validate: (value) => value === password || "Password tidak sama",
          }}
          render={({ field: { ...field } }) => (
            <FormControlAnimate
              label={true}
              type={isShowPassword2 ? "text" : "password"}
              id="Konfirmasi Password"
              name="confirmPassword"
              field={field}
              placeholder=""
              error={errors}
              handleShowPassword={handlePassword2}
            />
          )}
        />
        <ButtonElement title="Kirim" loading={isLoading} />
      </form>
    </Fragment>
  );
};

export default ResetPasswordView;
