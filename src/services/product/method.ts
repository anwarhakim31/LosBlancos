import instance from "@/utils/axios/instance";
import { TypeProduct } from "../type.module";

export const productService = {
  getProducts: (search?: string, limit?: number, page?: number) =>
    instance.get("/product", { params: { search, limit, page } }),
  create: (data: TypeProduct) => instance.post("/product", data),
};
