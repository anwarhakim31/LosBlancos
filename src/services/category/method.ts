import instance from "@/utils/axios/instance";

export const categoryService = {
  getCategory: (params: object) => instance.get("/category", { params }),
};

export const imageService = {};
