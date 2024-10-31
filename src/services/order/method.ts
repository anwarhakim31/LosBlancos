import instance from "@/utils/axios/instance";

export const orderService = {
  get: (user: string, payment: string, transaction: string) =>
    instance.get(
      "/order?user=" +
        user +
        "&payment=" +
        payment +
        "&transaction=" +
        transaction
    ),
};
