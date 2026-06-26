import { getEnv } from "../utils/get-env";

const envConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),

  PORT: Number(getEnv("PORT", "8000")),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI"),

  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET", "jwt_access_secret_key"),
  JWT_ACCESS_EXPIRES_IN: getEnv("JWT_ACCESS_EXPIRES_IN", "15m") as string,

  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "jwt_refresh_secret_key"),
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d") as string,

  GEMINI_API_KEY: getEnv("GEMINI_API_KEY"),

  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),

  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  RESEND_FROM_NAME: getEnv("RESEND_FROM_NAME"),
  RESEND_FROM: getEnv("RESEND_FROM", ""),

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),

  ENABLE_CRONS: getEnv("ENABLE_CRONS", "enable_crons"),
});

export const ENV = envConfig();
