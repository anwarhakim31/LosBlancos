import instance from "@/utils/axios/instance";
import { TypeUser } from "./type.module";

export const authService = {
  registerAccount: (data: TypeUser) => instance.post("/auth/register", data),
};
