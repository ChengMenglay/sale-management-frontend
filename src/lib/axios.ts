import axios from "axios";
import { API_URL } from "./apiEndPoints";
import { getSession, signOut } from "next-auth/react";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOption";

const isClient = typeof window !== 'undefined';
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 30000,
});

if (isClient) {
  axiosClient.interceptors.request.use(
    async (config) => {
      if (config.url?.includes("/public/")) {
        return config;
      }
      try {
        const session = await getSession();
        const user = session?.user as CustomUser | undefined;

        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      } catch (error) {
        console.error("Error getting session:", error);
        return config; // Continue request without auth header
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );


axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: "/login" });
    }
    return Promise.reject(error);
  }
);
}

export default axiosClient;