import instance from "@/utils/axios/instance";
import { TypeUser } from "./type.module";

export const authService = {
  registerAccount: (data: TypeUser) => instance.post("/auth/register", data),
  forgotPassword: (data: { email: string }) =>
    instance.post("/auth/forgot-password", data),
  resetPassword: (data: { password: string; token: string }) =>
    instance.post("/auth/reset-password", data),
};
