import { Request, Response, NextFunction } from "express";
import { TransactionSummaryService } from "@tracking/services/TransactionSummaryService";
import { UserId } from "@shared/primitives";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { MissingFieldError } from "@tracking/errors";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const timeZone = "Asia/Dhaka";

export class TransactionSummaryController {
  private summaryService: TransactionSummaryService;

  constructor(summaryService: TransactionSummaryService) {
    this.summaryService = summaryService;
  }

  async getMonthlySummary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;

      if (!userId) {
        throw new MissingFieldError("User ID is required");
      }

      const now = toZonedTime(new Date(), timeZone);
      
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);
      
      const previousMonthDate = subMonths(now, 1);
      const previousMonthStart = startOfMonth(previousMonthDate);
      const previousMonthEnd = endOfMonth(previousMonthDate);

      const summary = await this.summaryService.getMonthlySummary(
        UserId(userId),
        { start: currentMonthStart, end: currentMonthEnd },
        { start: previousMonthStart, end: previousMonthEnd }
      );

      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }
}

export default TransactionSummaryController;
