import instance from "@/utils/axios/instance";

export const orderService = {
  get: (user: string, transaction: string, payment?: string) => {
    const searchParams = new URLSearchParams();

    searchParams.set("user", user);
    searchParams.set("transaction", transaction);
    if (payment) searchParams.set("payment", payment);

    return instance.get("/order?" + searchParams.toString());
  },
};
