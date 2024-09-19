import ButtonElement from "@/components/element/ButtonSubmit";
import ErrorBadge from "@/components/element/ErrorBadge";
import FormControlAnimate from "@/components/fragments/FormControlAnimate";
import { authService } from "@/services/auth/method";
import { AxiosError } from "axios";

import { Fragment, useState, FC } from "react";
import { useForm, Controller } from "react-hook-form";

interface TypeUser {
  email: string;
}
interface ForgotViewProps {
  setSuccess: (success: boolean) => void;
}

const ForgotView: FC<ForgotViewProps> = ({ setSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [isError, setIsError] = useState<string>("");
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<TypeUser>({
    mode: "onSubmit",
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: TypeUser) => {
    setLoading(true);
    try {
      const res = await authService.forgotPassword(data);

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
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <ErrorBadge isError={isError} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{
          marginTop: "2rem",
        }}
      >
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
            <FormControlAnimate
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

        <ButtonElement title="Kirim" loading={loading} />
      </form>
    </Fragment>
  );
};

export default ForgotView;
