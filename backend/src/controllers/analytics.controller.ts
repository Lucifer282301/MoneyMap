import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { DateRangePreset } from "../enums/date-range.enum";
import { summaryAnalyticsService } from "../services/analytics.service";

export const summaryAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { preset, from, to } = req.query;

    const filter = {
      dateRangePreset: preset as DateRangePreset,
      customFrom: from ? new Date(from as string) : undefined,
      customTo: to ? new Date(to as string) : undefined,
    };

    const starts = await summaryAnalyticsService(
      userId,
      filter.dateRangePreset,
      filter.customFrom,
      filter.customTo,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Summary fetched successfully",
      data: starts,
    });
  },
);
