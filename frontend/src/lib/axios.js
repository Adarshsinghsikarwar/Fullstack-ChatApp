import axios from "axios";

const normalizeUrl = (url = "") => url.trim().replace(/\/+$/, "");

const ensureApiPath = (url = "") => {
  const cleaned = normalizeUrl(url);
  return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
};

const resolvedApiBaseUrl = (() => {
  const fromEnv = normalizeUrl(import.meta.env.VITE_API_URL || "");
  if (fromEnv) return ensureApiPath(fromEnv);

  if (import.meta.env.DEV) {
    return "http://localhost:3000/api";
  }

  return "https://fullstack-chatapp-j0vu.onrender.com/api";
})();

export const API_BASE_URL = resolvedApiBaseUrl;
export const API_ORIGIN = resolvedApiBaseUrl.replace(/\/api$/, "");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
