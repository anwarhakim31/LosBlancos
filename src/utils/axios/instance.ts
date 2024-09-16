import axios from "axios";

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
  (config) => config,
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default instance;
