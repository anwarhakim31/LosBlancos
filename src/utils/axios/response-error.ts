import { AxiosError } from "axios";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ResponseError = (error: any) => {
  if (
    error instanceof AxiosError &&
    error.response &&
    error.response.data.message
  ) {
    return toast.error(error.response.data.message);
  }
};
