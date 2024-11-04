import instance from "@/utils/axios/instance";

export const ongkirService = {
  province: () => instance.get("/binderbyte/province"),
  city: (id: string) => instance.get("/binderbyte/city?province_id=" + id),
  ongkir: (desCity: string, desProvince: string, transactionId: string) =>
    instance.get(
      `/binderbyte/ongkir?desProvince=${desProvince}&desCity=${desCity}&transactionId=${transactionId}`
    ),
};
