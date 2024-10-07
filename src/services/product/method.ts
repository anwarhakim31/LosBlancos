import instance from "@/utils/axios/instance";
import { TypeProduct } from "../type.module";

export const productService = {
  getProducts: () => {},
  create: (data: TypeProduct) => instance.post("/product", data),
};
