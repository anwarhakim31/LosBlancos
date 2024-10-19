import instance from "@/utils/axios/instance";

export const ongkirService = {
  province: () => instance.get("/binderbyte/province"),
  city: (id: string) => instance.get("/binderbyte/city?province_id=" + id),
  ongkir: (
    origin: string,
    destination: string,
    weight: string,
    volume: string
  ) =>
    instance.get(
      `/binderbyte/ongkir?origin=${origin}&destination=${destination}&weight=${weight}&volume=${volume}`
    ),
};
