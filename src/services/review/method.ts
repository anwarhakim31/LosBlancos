import instance from "@/utils/axios/instance";

export const reviewService = {
  create: (data: {
    transactionId: string;
    itemId: string;
    product: string;
    comment: string;
    rating: number;
    user: string;
  }) => instance.post("/review", data),
  get: (id: string) => instance.get("/review?transactionId=" + id),
  getAdmin: (searchParams: string) =>
    instance.get("/review/admin?" + searchParams),
  deleteOne: (id: string) => instance.delete("/review/admin?reviewId=" + id),
  updateOne: (id: string, data: { comment: string }) =>
    instance.put("/review/admin?reviewId=" + id, data),
  deleteAll: (data: string[]) =>
    instance.delete("/review/admin/delete-all", { data }),
};
