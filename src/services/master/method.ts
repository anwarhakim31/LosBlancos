import instance from "@/utils/axios/instance";
import { TypeCarousel, TypeMaster } from "../type.module";

export const masterService = {
  addCarousel: (data: TypeCarousel) => instance.post("/master/carousel", data),
  getCarousel: () => instance.get("/master/carousel"),
  deleteCarousel: (id: string) => instance.delete(`/master/carousel/${id}`),
  editCarousel: (id: string, data: TypeCarousel) =>
    instance.put(`/master/carousel/${id}`, data),
  getMarquee: () => instance.get("/master/marquee"),
  editMarquee: (data: { image: string; id: string }) =>
    instance.post("/master/marquee", data),
  toggleMarquee: (checked: boolean) =>
    instance.put("/master/marquee", {
      display: checked,
    }),
  getMain: () => instance.get("/master/main"),
  editMain: (data: TypeMaster) => instance.patch("/master/main", data),
  getGaleri: () => instance.get("/master/galeri"),
  editGaleri: (data: { image: string; id: string }) =>
    instance.post("/master/galeri", data),
};
