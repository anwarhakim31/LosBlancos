import instance from "@/utils/axios/instance";

export const ongkirService = {
  province: () => instance.get("/rajaongkir/province"),
  city: (id: string) => instance.get("/rajaongkir/city?province=" + id),
};
