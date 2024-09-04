import instance from "@/utils/axios/instance";
import { TypeCategory } from "../type.module";

export const categoryService = {
  getCategory: (params: object) => instance.get("/category", { params }),
  addCategory: (data: TypeCategory) => instance.post("/category", data),
};

export const imageService = {};
