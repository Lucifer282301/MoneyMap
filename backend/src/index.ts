import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { ENV } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import connectDatabase from "./config/database.config";

const app = express();
const BASE_PATH = ENV.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(errorHandler);

app.listen(ENV.PORT, async () => {
  await connectDatabase();
  console.log(`Server is running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
});
