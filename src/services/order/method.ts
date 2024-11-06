import instance from "@/utils/axios/instance";

export const orderService = {
  get: (
    user: string,
    transaction: string,
    payment?: string,
    limit?: number,
    page?: number
  ) => {
    const searchParams = new URLSearchParams();

    searchParams.set("user", user);
    searchParams.set("transaction", transaction);
    if (limit) searchParams.set("limit", limit.toString());
    if (page) searchParams.set("page", page.toString());
    if (payment) searchParams.set("payment", payment);

    return instance.get("/order?" + searchParams.toString());
  },
};
