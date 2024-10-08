import instance from "@/utils/axios/instance";
import { TypeCollection } from "../type.module";

export const collectionSevice = {
  getCollection: (search: string, limit?: number, page?: number) =>
    instance.get("/collection", { params: { search, limit, page } }),
  addCollection: (data: TypeCollection) => instance.post("/collection", data),
  deleteMany: (data: string[]) => instance.delete("/collection", { data }),
  deleteOne: (id: string) => instance.delete("/collection/" + id),
  editCollection: (id: string, data: TypeCollection) =>
    instance.put("/collection/" + id, data),
};
