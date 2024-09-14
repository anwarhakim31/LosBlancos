import ButtonElement from "@/components/element/Button";
import FormControlFragment from "@/components/fragments/FormControl";
import Link from "next/link";
import styles from "./loginview.module.scss";
import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

const LoginView = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>({ defaultValues: { email: "", password: "" } });

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");

  const { push } = useRouter();

  const callbackUrl: string = "/";
  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });

      if (res?.ok) {
        push(callbackUrl);
        reset();
      } else {
        setIsError("Email dan Password salah");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isError) {
      const timeOut = setTimeout(() => {
        setIsError("");
      }, 3000);
      return () => clearTimeout(timeOut);
    }
  }, [isError]);

  return (
    <Fragment>
      <span className={styles.error}>{isError}</span>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email tidak boleh kosong",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email tidak valid",
            },
          }}
          render={({ field: { ...field } }) => (
            <FormControlFragment
              type="email"
              placeholder=""
              label={true}
              name="email"
              id="email"
              field={field}
              error={errors}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password tidak boleh kosong",
            minLength: { value: 6, message: "Password minimal 6 karakter" },
          }}
          render={({ field: { ...field } }) => (
            <FormControlFragment
              type={isShowPassword ? "text" : "password"}
              placeholder=""
              name="password"
              id="password"
              field={field}
              label={true}
              error={errors}
              handleShowPassword={handleShowPassword}
            />
          )}
        />

        <Link href={"/forgot-password"} className={styles.link}>
          Lupa Password?
        </Link>
        <ButtonElement type="submit" title="Masuk" loading={isLoading} />
      </form>
    </Fragment>
  );
};

export default LoginView;
