import instance from "@/utils/axios/instance";
import { TypeCategory } from "../type.module";

export const categoryService = {
  getCategory: (params: object) => instance.get("/category", { params }),
  addCategory: (data: TypeCategory) => instance.post("/category", data),
  deleteMany: (data: string[]) => instance.delete("/category", { data }),
  deleteOne: (id: string) => instance.delete("/category/" + id),
  editCategory: (data: TypeCategory) =>
    instance.put("/category/" + data._id, data),
};
