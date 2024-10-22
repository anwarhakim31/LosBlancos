import instance from "@/utils/axios/instance";
import { itemCartType } from "../type.module";

export const transactionService = {
  create: (
    userId: string,
    items: itemCartType[],
    total: number,
    cartId?: string
  ) => instance.post("/transaction", { userId, items, total, cartId }),
  get: (transactionId: string, userId: string) =>
    instance.get(
      "/transaction?transactionId=" + transactionId + "&userId=" + userId
    ),
  payment: (shippingCost: number, bank: string, transaction_id: string) =>
    instance.post("transaction/payment", {
      shippingCost,
      bank,
      transaction_id,
    }),
};
