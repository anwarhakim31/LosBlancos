import ButtonElement from "@/components/element/Button";
import FormControlFragment from "@/components/fragments/FormControl";
import { useRouter } from "next/navigation";

import { Fragment, useState } from "react";
import { useForm, Controller } from "react-hook-form";

interface Input {
  username: string;
  email: string;
  password: string;
}

const RegisterView = () => {
  const Router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Input>({
    mode: "onSubmit",
    defaultValues: { username: "", email: "", password: "" },
  });
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const onSubmit = async (data: Input) => {
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();

      if (!res.ok) {
        if (resJson.message === "Email sudah digunakan") {
          setError("email", { type: "manual", message: resJson.message });
        }
        throw new Error(resJson.message);
      }

      if (resJson.status === 201) {
        Router.push("/login");
      }
    } catch (error) {
      console.log(error);
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
          name="username"
          rules={{
            required: "Username tidak boleh kosong.",
            minLength: { value: 6, message: "Username minimal 6 karakter" },
          }}
          render={({ field: { ...field } }) => (
            <FormControlFragment
              type="text"
              placeholder=""
              name="username"
              id="username"
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
