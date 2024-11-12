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
};
