import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import UserModel from "../models/user.model";

const periodEndDate = (interval: "monthly" | "yearly") =>
  new Date(Date.now() + (interval === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000);

export const getSubscriptionStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Authentication required" });
    }

    const user = await UserModel.findById(userId).select(
      "plan subscriptionStatus subscriptionId interval currentPeriodEnd trialEnd",
    );

    const isActive = user?.subscriptionStatus === "active";

    return res.status(HTTPSTATUS.OK).json({
      plan: user?.plan ?? "free",
      subscriptionStatus: user?.subscriptionStatus ?? null,
      interval: isActive ? (user?.interval ?? "monthly") : null,
      trialDaysRemaining: null,
      currentPeriodEnd: user?.currentPeriodEnd?.toISOString() ?? null,
    });
  },
);

export const confirmUpgradeController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Authentication required" });
    }

    const interval: "monthly" | "yearly" =
      req.body.interval === "yearly" ? "yearly" : "monthly";

    await UserModel.findByIdAndUpdate(userId, {
      plan: "pro",
      subscriptionStatus: "active",
      subscriptionId: `sub_fake_${Date.now()}`,
      interval,
      currentPeriodEnd: periodEndDate(interval),
      trialEnd: null,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully upgraded to the MoneyMap Pro plan.",
    });
  },
);

export const switchIntervalController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Authentication required" });
    }

    const user = await UserModel.findById(userId).select("plan subscriptionStatus");
    if (user?.plan !== "pro" || user?.subscriptionStatus !== "active") {
      return res.status(HTTPSTATUS.FORBIDDEN).json({
        message: "Only active Pro subscribers can switch billing intervals",
      });
    }

    const interval: "monthly" | "yearly" =
      req.body.interval === "yearly" ? "yearly" : "monthly";

    await UserModel.findByIdAndUpdate(userId, {
      interval,
      currentPeriodEnd: periodEndDate(interval),
    });

    return res.status(HTTPSTATUS.OK).json({
      message: `Successfully switched to the ${interval.toUpperCase()} plan.`,
    });
  },
);

export const cancelSubscriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Authentication required" });
    }

    await UserModel.findByIdAndUpdate(userId, {
      plan: "free",
      subscriptionStatus: "canceled",
      subscriptionId: null,
    });

    return res.status(HTTPSTATUS.OK).json({ message: "Subscription canceled" });
  },
);
