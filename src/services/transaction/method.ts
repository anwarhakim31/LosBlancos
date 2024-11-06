import instance from "@/utils/axios/instance";
import { itemCartType, TypeOngkir, TypeShippingAddress } from "../type.module";

export const transactionService = {
  create: (
    userId: string,
    items: itemCartType[],
    total: number,
    cartId?: string,
    discountId?: string
  ) =>
    instance.post("/transaction", { userId, items, total, cartId, discountId }),

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
  ewalletPayment: (
    shipping: TypeOngkir,
    payment: string,
    transaction_id: string,
    shippingAddress: TypeShippingAddress
  ) =>
    instance.post("transaction/ewallet-payment", {
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
  getAll: (quary: string) => instance.get("/transaction/admin?" + quary),
  editStatus: (
    invoice: string,
    data: { transactionStatus: string; paymentStatus: string }
  ) => instance.put("/transaction/status?invoice=" + invoice, data),
  deleteOne: (id: string) =>
    instance.delete("/transaction?transactionId=" + id),
  deleteMany: (data: string[]) =>
    instance.delete("/transaction/delete-many", { data }),
  repayment: (
    shipping: TypeOngkir,
    payment: string,
    transaction_id: string,
    shippingAddress: TypeShippingAddress
  ) => {
    return instance.put("/transaction", {
      shipping,
      payment,
      transaction_id,
      shippingAddress,
    });
  },
};
