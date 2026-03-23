import dotenv from "dotenv";
dotenv.config();

const normalizeOrigin = (origin = "") => origin.trim().replace(/\/+$/, "");

const parseOriginList = (value = "") =>
  value
    .split(",")
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);

const defaultClientOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://fullstack-chat-app-sandy.vercel.app",
];

const configuredClientOrigins = [
  ...parseOriginList(process.env.CLIENT_URL),
  ...parseOriginList(process.env.CORS_ORIGINS),
];

const resolvedClientOrigins = [
  ...new Set([...defaultClientOrigins, ...configuredClientOrigins]),
];

const isProduction = process.env.NODE_ENV === "production";

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI,
  SECRET_KEY: process.env.SECRET_KEY,
  CLIENT_URL: resolvedClientOrigins.join(","),
  CORS_ORIGINS: (process.env.CORS_ORIGINS || "").trim(),
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  },
};
