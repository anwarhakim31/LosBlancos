import axios from "axios";
import { getSession } from "next-auth/react";

const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "cache-control": "no-cache",
  Expire: 0,
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: header,
  timeout: 60 * 1000,
});

instance.interceptors.request.use(
  async (config) => {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    const session = await getSession();
    if (session?.user?.accessToken) {
      config.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default instance;
