import instance from "@/utils/axios/instance";
import { TypeCarousel } from "../type.module";

export const masterService = {
  addCarousel: (data: TypeCarousel) => instance.post("/master/carousel", data),
  getCarousel: () => instance.get("/master/carousel"),
  deleteCarousel: (id: string) => instance.delete(`/master/carousel/${id}`),
  editCarousel: (id: string, data: TypeCarousel) =>
    instance.put(`/master/carousel/${id}`, { data }),
};
