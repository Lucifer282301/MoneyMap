import { Router } from "express";
import {
  bulkDeleteTransactionController,
  bulkTransactionController,
  createTransactionController,
  deleteTransactionController,
  duplicateTransactionController,
  getAllTransactionController,
  getTransactionByIdController,
  updateTransactionController,
} from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.post("/create", createTransactionController);

transactionRouter.put("/duplicate/:id", duplicateTransactionController);
transactionRouter.put("/update/:id", updateTransactionController);
transactionRouter.post("/bulk-transaction", bulkTransactionController);

transactionRouter.get("/all", getAllTransactionController);
transactionRouter.get("/:id", getTransactionByIdController);
transactionRouter.delete("/delete/:id", deleteTransactionController);
transactionRouter.delete("/bulk-delete", bulkDeleteTransactionController);

export default transactionRouter;
