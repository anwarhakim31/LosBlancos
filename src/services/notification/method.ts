import instance from "@/utils/axios/instance";

export const notifMethod = {
  makeReadOne: (messageId: string, dataId: string) =>
    instance.post(`/notification`, { messageId, dataId }),
  makeReadAll: () => instance.delete(`/notification`),
};
