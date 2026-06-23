import "dotenv/config";
import "./config/passport.config";
import express from "express";
import cors from "cors";
import passport from "passport";
import { ENV } from "./config/env.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import connectDatabase from "./config/database.config";
import authRoutes from "./routes/auth.routes";
import { passportAuthenticateJwt } from "./config/passport.config";
import userRoutes from "./routes/user.routes";
import transactionRoutes from "./routes/transaction.routes";
import { initializeCrons } from "./crons";
import reportRoutes from "./routes/report.routes";
import analyticsRoutes from "./routes/analytics.routes";
import billingRoutes from "./routes/billing.routes";

const app = express();
const BASE_PATH = ENV.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(
  cors({
    origin: ENV.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, reportRoutes);
app.use(`${BASE_PATH}/analytics`, passportAuthenticateJwt, analyticsRoutes);
app.use(`${BASE_PATH}/billing`, passportAuthenticateJwt, billingRoutes);

app.use(errorHandler);

app.listen(ENV.PORT, async () => {
  await connectDatabase();

  if (ENV.NODE_ENV === "development") {
    await initializeCrons();
  }

  console.log(`Server is running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
});
