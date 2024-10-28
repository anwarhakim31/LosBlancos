import instance from "@/utils/axios/instance";
import { TypeReview } from "../type.module";

export const reviewService = {
  create: (data: TypeReview) => instance.post("/review", data),
};
