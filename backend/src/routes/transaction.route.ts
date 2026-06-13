import { Router } from "express";
import {
  createTransactionController,
  getAllTransactionController,
} from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.post("/create", createTransactionController);
transactionRouter.get("/all", getAllTransactionController);

export default transactionRouter;
