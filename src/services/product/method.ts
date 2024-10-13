import instance from "@/utils/axios/instance";

import { inputProductType } from "@/utils/InputTypes.module";

export const productService = {
  getProducts: (search: string, page?: number, limit?: number) => {
    return instance.get("/product", { params: { search, limit, page } });
  },
  deleteMany: (data: string[]) => instance.delete("/product/", { data }),
  deleteOne: (id: string) => instance.delete("/product/" + id),
  create: (data: inputProductType) => instance.post("/product", data),
  edit: (data: inputProductType, id: string) =>
    instance.put("/product/" + id, data),
};
