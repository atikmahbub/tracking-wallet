import { Request, Response, NextFunction } from "express";
import TransactionService from "@tracking/services/TransactionService";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { UserId } from "@shared/primitives";
import { startOfMonth, endOfMonth } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { MissingFieldError } from "@tracking/errors";

const timeZone = "Asia/Dhaka";

class TransactionController {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  async getTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.query;
      const { date } = req.query;

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (date) {
        const extractedDate = toZonedTime(
          new Date(parseInt(date.toString()) * 1000),
          timeZone
        );
        startDate = fromZonedTime(startOfMonth(extractedDate), timeZone);
        endDate = fromZonedTime(endOfMonth(extractedDate), timeZone);
      }

      const transactions = await this.transactionService.getTransactions(
        UserId(userId as string),
        startDate,
        endDate
      );

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
}

export default TransactionController;
