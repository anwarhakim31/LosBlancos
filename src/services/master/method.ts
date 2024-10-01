import instance from "@/utils/axios/instance";
import { TypeCarousel } from "../type.module";

export const masterService = {
  addCarousel: (data: TypeCarousel) => instance.post("/master/carousel", data),
};
