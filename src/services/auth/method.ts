import instance from "@/utils/axios/instance";
import { TypeUser } from "./type.module";
import axios from "axios";

export const authService = {
  registerAccount: (data: TypeUser) => instance.post("/auth/register", data),
  forgotPassword: (data: { email: string }) =>
    instance.post("/auth/forgot-password", data),
  resetPassword: (data: { password: string; token: string }) =>
    instance.post("/auth/reset-password", data),
};

export const userService = {
  updateUser: (id: string, data: TypeUser) =>
    instance.post(`/user/${id}`, data),
};

export const imageService = {
  upload: async (data: FormData) => {
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
};
