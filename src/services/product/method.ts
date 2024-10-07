import instance from "@/utils/axios/instance";
import { TypeProduct } from "../type.module";

export const productService = {
  getProducts: (search: string, page: number, limit: number) => {
    return instance.get("/product", { params: { search, limit, page } });
  },
  deleteMany: (data: string[]) => instance.delete("/product/", { data }),
  deleteOne: (id: string) => instance.delete("/product/" + id),
  create: (data: TypeProduct) => instance.post("/product", data),
  edit: (data: TypeProduct, id: string) => instance.put("/product/" + id, data),
};
