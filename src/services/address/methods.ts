import instance from "@/utils/axios/instance";
import { inputAddressType } from "@/utils/InputTypes.module";

export const addressService = {
  get: (userId: string) => instance.get("/address?userId=" + userId),
  create: (data: inputAddressType) => instance.post("/address", data),
  delete: (addressId: string, userId: string) =>
    instance.delete(
      "/address?addressId=" + addressId + "&userId=" + userId + ""
    ),
};
