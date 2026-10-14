import { Request, Response, NextFunction } from "express";
import { TransactionSummaryService } from "@tracking/services/TransactionSummaryService";
import { UserId } from "@shared/primitives";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { MissingFieldError } from "@tracking/errors";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

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

      const dateParam = req.query.date as string;
      const baseDate = dateParam ? new Date(parseInt(dateParam, 10) * 1000) : new Date();
      const zonedBaseDate = toZonedTime(baseDate, timeZone);
      
      const currentMonthStart = fromZonedTime(startOfMonth(zonedBaseDate), timeZone);
      const currentMonthEnd = fromZonedTime(endOfMonth(zonedBaseDate), timeZone);
      
      const previousMonthDate = subMonths(zonedBaseDate, 1);
      const previousMonthStart = fromZonedTime(startOfMonth(previousMonthDate), timeZone);
      const previousMonthEnd = fromZonedTime(endOfMonth(previousMonthDate), timeZone);

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
