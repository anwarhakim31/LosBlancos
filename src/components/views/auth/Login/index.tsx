import ButtonElement from "@/components/element/ButtonSubmit";
import FormControlAnimate from "@/components/fragments/FormControlAnimate";
import Link from "next/link";
import styles from "./loginview.module.scss";
import React, { Fragment, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import ErrorBadge from "@/components/element/ErrorBadge";

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
  const searchParams = useSearchParams();

  const { push } = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

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

  return (
    <Fragment>
      <ErrorBadge isError={isError} />
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
            <FormControlAnimate
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
            <FormControlAnimate
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

        <Link href={"/forget-password"} className={styles.link}>
          Lupa Password?
        </Link>
        <ButtonElement title="Masuk" loading={isLoading} />
      </form>
    </Fragment>
  );
};

export default LoginView;
