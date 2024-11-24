import instance from "@/utils/axios/instance";

export const testimoniService = {
  create: (data: {
    name: string;
    transactionId: string;
    image: string;
    comment: string;
  }) => instance.post("/testi", data),
  get: (id: string) => instance.get("/testi?transactionId=" + id),
  getAdmin: (searchParams: string) =>
    instance.get("/testi/admin?" + searchParams),
  deleteOne: (id: string) =>
    instance.delete("/testi/admin?transactionId=" + id),
  status: (id: string) => instance.put("/testi/admin?transactionId=" + id),
  deletMany: (data: string[]) => instance.delete("/testi/all", { data }),
};
