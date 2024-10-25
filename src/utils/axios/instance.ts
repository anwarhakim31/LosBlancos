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
let cachedAccessToken: string | null = null;
instance.interceptors.request.use(
  async (config) => {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    if (!cachedAccessToken) {
      const session = await getSession();
      cachedAccessToken = session?.user?.accessToken || null;
    }

    if (cachedAccessToken) {
      config.headers["Authorization"] = `Bearer ${cachedAccessToken}`;
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
