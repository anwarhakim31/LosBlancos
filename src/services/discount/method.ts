import instance from "@/utils/axios/instance";

export const diskonService = {
  apply: (code: string) => instance.get(`/diskon?code=${code}`),
};
