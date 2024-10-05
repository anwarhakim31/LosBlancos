import instance from "@/utils/axios/instance";
import { TypeAttribute } from "../type.module";

export const attributeService = {
  getAttribute: (search: string, limit: number, page: number) =>
    instance.get("/attribute", {
      params: {
        search,
        limit,
        page,
      },
    }),
  postAtribute: (data: TypeAttribute) => instance.post("/attribute", data),
  deleteMany: (data: string[]) => instance.delete("/attribute", { data }),
  deleteOne: (id: string) => instance.delete("/attribute/" + id),
  editAtrribute: (id: string, data: TypeAttribute) =>
    instance.put("/attribute/" + id, data),
};
