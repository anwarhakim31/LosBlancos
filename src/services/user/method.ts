import instance from "@/utils/axios/instance";
import { TypeUser } from "../type.module";

export const userService = {
  getUser: (params: object) => instance.get("/user", { params }),
  updateUser: (id: string, data: TypeUser) => instance.put(`/user/${id}`, data),
  deleteOne: (id: string | undefined) => instance.delete(`/user/${id}`),
  deleteMany: (data: string[]) => instance.delete(`/user`, { data }),
};

export const imageService = {
  uploadUser: (data: FormData) => instance.post("/user/image/upload", data),
  deleteUser: (data: { filename: string }) =>
    instance.delete("/user/image/delete", { data }),
};
