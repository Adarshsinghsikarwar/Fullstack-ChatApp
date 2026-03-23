import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://fullstack-chatapp-j0vu.onrender.com/api",
  withCredentials: true,
});
