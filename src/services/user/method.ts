import instance from "@/utils/axios/instance";
import { TypeUser } from "../type.module";

export const userService = {
  getUser: () => instance.get("/user"),
  updateUser: (id: string, data: TypeUser) => instance.put(`/user/${id}`, data),
};

export const imageService = {
  uploadUser: async (data: FormData) =>
    instance.post("/user/image/upload", data),
  deleteUser: (data: { filename: string }) =>
    instance.delete("/user/image/delete", { data }),
};
