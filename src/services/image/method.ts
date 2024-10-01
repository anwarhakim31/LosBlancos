import instance from "@/utils/axios/instance";

export const imageService = {
  upload: (data: FormData) => instance.post("/image/upload", data),
  delete: (data: string) =>
    instance.delete("/image/delete", { data: { filename: data } }),
};
