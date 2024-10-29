import instance from "@/utils/axios/instance";
import axios from "axios";

export const imageService = {
  upload: (data: FormData, setProgress: (progress: number) => void) => {
    return axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
      data,
      {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;

          const percentage = Math.floor((loaded * 100) / (total || 1));

          setProgress(percentage);
        },
      }
    );
  },
  delete: (url: string) => instance.delete("/image/delete", { data: url }),
};
