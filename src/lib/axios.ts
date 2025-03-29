import axios from "axios";
import { API_URL } from "./apiEndPoints";
import { getSession } from "next-auth/react";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOption";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user) {
      const user = session.user as CustomUser;
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
