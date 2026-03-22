import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://fullstack-chatapp-0dvc.onrender.com/api",
  withCredentials: true,
});
