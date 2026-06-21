import { Router } from "express";
import {
  getSubscriptionStatusController,
  confirmUpgradeController,
  cancelSubscriptionController,
  switchIntervalController,
} from "../controllers/billing.controller";

const billingRoutes = Router();

billingRoutes.get("/subscription", getSubscriptionStatusController);
billingRoutes.post("/confirm", confirmUpgradeController);
billingRoutes.post("/cancel", cancelSubscriptionController);
billingRoutes.post("/switch-interval", switchIntervalController);

export default billingRoutes;
