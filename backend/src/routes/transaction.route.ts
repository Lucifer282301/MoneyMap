import { Router } from "express";
import {
  bulkDeleteTransactionController,
  bulkTransactionController,
  createTransactionController,
  deleteTransactionController,
  duplicateTransactionController,
  getAllTransactionController,
  getTransactionByIdController,
  scanReceiptController,
  updateTransactionController,
} from "../controllers/transaction.controller";
import { upload } from "../config/cloudinary.config";

const transactionRouter = Router();

transactionRouter.post("/create", createTransactionController);

transactionRouter.post(
  "/scan-receipt",
  upload.single("receipt"),
  scanReceiptController,
);

transactionRouter.put("/duplicate/:id", duplicateTransactionController);
transactionRouter.put("/update/:id", updateTransactionController);
transactionRouter.post("/bulk-transaction", bulkTransactionController);

transactionRouter.get("/all", getAllTransactionController);
transactionRouter.get("/:id", getTransactionByIdController);
transactionRouter.delete("/delete/:id", deleteTransactionController);
transactionRouter.delete("/bulk-delete", bulkDeleteTransactionController);

export default transactionRouter;
