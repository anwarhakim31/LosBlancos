"use client";

import { Controller, useForm } from "react-hook-form";
import FormControlFragment from "@/components/fragments/FormControl";
import { Fragment, useState, FC } from "react";
import ButtonElement from "@/components/element/Button";

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
    handleSubmit,
  } = useForm<TypeReset>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const [isShowPassword1, setIsShowPassword1] = useState<boolean>(false);
  const [isShowPassword2, setIsShowPassword2] = useState<boolean>(false);

  const onSubmit = (data: TypeReset) => {
    setSuccess(true);
    console.log(data);
  };

  const handlePassword1 = () => {
    setIsShowPassword1(!isShowPassword1);
  };
  const handlePassword2 = () => {
    setIsShowPassword2(!isShowPassword2);
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "2rem" }}>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password tidak boleh kosong",
            minLength: { value: 6, message: "Password minimal 6 karakter" },
          }}
          render={({ field: { ...field } }) => (
            <FormControlFragment
              {...field}
              label={true}
              type={isShowPassword1 ? "text" : "password"}
              id="password"
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
            required: "Konfimasi Password tidak boleh kosong",
            minLength: { value: 6, message: "Password minimal 6 karakter" },
            validate: (value) =>
              value !== control._getWatch("password") && "Password tidak sama",
          }}
          render={({ field: { ...field } }) => (
            <FormControlFragment
              {...field}
              label={true}
              type={isShowPassword1 ? "text" : "password"}
              id="Konfirmasi Password"
              name="confirmPassword"
              field={field}
              placeholder=""
              error={errors}
              handleShowPassword={handlePassword2}
            />
          )}
        />
        <ButtonElement type="submit" title="Kirim" />
      </form>
    </Fragment>
  );
};

export default ResetPasswordView;
