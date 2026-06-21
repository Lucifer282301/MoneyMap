import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import UserModel from "../models/user.model";

export const getSubscriptionStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Authentication required",
      });
    }
    const user = await UserModel.findById(userId).select(
      "plan subscriptionStatus subscriptionId interval trialEnd",
    );

    let trialDaysRemaining: number | null = null;
    if (user?.trialEnd) {
      const diff = user.trialEnd.getTime() - Date.now();
      trialDaysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    return res.status(HTTPSTATUS.OK).json({
      plan: user?.plan ?? "free",
      subscriptionStatus: user?.subscriptionStatus ?? null,
      interval: user?.interval ?? "monthly",
      trialDaysRemaining,
      currentPeriodEnd: user?.subscriptionId
        ? new Date(
            Date.now() +
              (user.interval === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000,
          ).toISOString()
        : null,
    });
  },
);

export const confirmUpgradeController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Authentication required",
      });
    }
    const interval: "monthly" | "yearly" =
      req.body.interval === "yearly" ? "yearly" : "monthly";

    await UserModel.findByIdAndUpdate(userId, {
      plan: "pro",
      subscriptionStatus: "active",
      subscriptionId: `sub_fake_${Date.now()}`,
      interval,
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
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Authentication required",
      });
    }
    const user = await UserModel.findById(userId).select(
      "plan subscriptionStatus",
    );
    if (user?.plan !== "pro" || user?.subscriptionStatus !== "active") {
      return res.status(HTTPSTATUS.FORBIDDEN).json({
        message: "Only active Pro subscribers can switch billing intervals",
      });
    }
    const interval: "monthly" | "yearly" =
      req.body.interval === "yearly" ? "yearly" : "monthly";

    await UserModel.findByIdAndUpdate(userId, { interval });

    return res.status(HTTPSTATUS.OK).json({
      message: `Successfully switched to the ${interval.toUpperCase()} plan.`,
    });
  },
);

export const cancelSubscriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Authentication required",
      });
    }
    await UserModel.findByIdAndUpdate(userId, {
      plan: "free",
      subscriptionStatus: "canceled",
      subscriptionId: null,
      interval: "monthly",
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Subscription canceled",
    });
  },
);
