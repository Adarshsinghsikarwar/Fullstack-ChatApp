import { config } from "./config.js";

const normalizeOrigin = (origin = "") => origin.trim().replace(/\/+$/, "");

const parseOriginList = (value = "") =>
  value
    .split(",")
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);

const defaultDevOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const configuredOrigins = [
  ...parseOriginList(config.CLIENT_URL),
  ...parseOriginList(process.env.CORS_ORIGINS),
];

const uniqueConfiguredOrigins = [...new Set(configuredOrigins)];

export const allowedOrigins =
  config.NODE_ENV === "production"
    ? uniqueConfiguredOrigins
    : [...new Set([...uniqueConfiguredOrigins, ...defaultDevOrigins])];

export const corsOriginValidator = (origin, callback) => {
  // Allow server-to-server or non-browser requests that do not send Origin.
  if (!origin) {
    callback(null, true);
    return;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  if (allowedOrigins.includes(normalizedOrigin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`Not allowed by CORS: ${origin}`));
};
