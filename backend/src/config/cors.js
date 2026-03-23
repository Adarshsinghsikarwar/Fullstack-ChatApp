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

const fallbackOrigins =
  uniqueConfiguredOrigins.length > 0 || config.NODE_ENV === "production"
    ? uniqueConfiguredOrigins
    : defaultDevOrigins;

export const allowedOrigins = fallbackOrigins;

export const corsOriginValidator = (origin, callback) => {
  // Some tools/servers omit Origin; allow these non-browser requests.
  if (!origin) {
    callback(null, true);
    return;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const isAllowed = allowedOrigins.includes(normalizedOrigin);

  if (isAllowed) {
    callback(null, true);
    return;
  }

  callback(new Error(`Not allowed by CORS: ${origin}`));
};
