import instance from "@/utils/axios/instance";
import { itemCartType, TypeOngkir, TypeShippingAddress } from "../type.module";

export const transactionService = {
  create: (
    userId: string,
    items: itemCartType[],
    total: number,
    cartId?: string
  ) => instance.post("/transaction", { userId, items, total, cartId }),
  get: (transactionId: string) =>
    instance.get("/transaction?transactionId=" + transactionId),
  payment: (
    shipping: TypeOngkir,
    payment: string,
    transaction_id: string,
    shippingAddress: TypeShippingAddress
  ) =>
    instance.post("transaction/payment", {
      shipping,
      payment,
      transaction_id,
      shippingAddress,
    }),
  changePayment: (order_id: string) =>
    instance.post("transaction/change-payment", { order_id }),
  cancelPayment: (order_id: string) =>
    instance.post("transaction/cancel-payment", { order_id }),
  cekStatus: (order_id: string) =>
    instance.get(`transaction/status?order_id=${order_id}`),
  cekStock: (order_id: string) =>
    instance.get(`transaction/cek-stock?order_id=${order_id}`),
  rebuy: (order_id: string) =>
    instance.post("transaction/rebuy?order_id=" + order_id),
};
