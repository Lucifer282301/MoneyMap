import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import { ENV } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import connectDatabase from "./config/database.config";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import { passportAuthenticateJwt } from "./config/passport.config";
import transactionRouter from "./routes/transaction.route";

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

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException("This is a error");
    res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to the channel.",
    });
  }),
);

app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRouter);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRouter);

app.use(errorHandler);

app.listen(ENV.PORT, async () => {
  await connectDatabase();
  console.log(`Server is running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
});
