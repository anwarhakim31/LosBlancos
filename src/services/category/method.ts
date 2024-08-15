import instance from "@/utils/axios/instance";
import { TypeCategory } from "../type.module";

export const categoryService = {
  get: (search: string, limit: number, page: number) =>
    instance.get("/category", { params: { search, limit, page } }),
  add: (data: TypeCategory) => instance.post("/category", data),
  deleteMany: (data: string[]) => instance.delete("/category", { data }),
  deleteOne: (id: string) => instance.delete("/category/" + id),
  edit: (id: string, data: TypeCategory) =>
    instance.put("/category/" + id, data),
};
