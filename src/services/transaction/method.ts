import instance from "@/utils/axios/instance";
import { itemCartType } from "../type.module";

export const transactionService = {
  create: (userId: string, items: itemCartType[], total: number) =>
    instance.post("/transaction", { userId, items, total }),
  get: (id: string) => instance.get("/transaction?id=" + id),
};
