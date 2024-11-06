import instance from "@/utils/axios/instance";

export const diskonService = {
  apply: (code: string) => instance.get(`/diskon?code=${code}`),
  get: (searchParams: string) => instance.get("/diskon/admin?" + searchParams),
  add: (data: { code: string; percent: number | null; info: string }) =>
    instance.post("/diskon/admin", data),
  deleteOne: (id: string) => instance.delete("/diskon/admin?id=" + id),
  deleteMany: (data: string[]) => instance.delete("/diskon", { data }),
  edit: (data: { code: string; percent: number; info: string; id: string }) =>
    instance.put("/diskon/admin", data),
};
