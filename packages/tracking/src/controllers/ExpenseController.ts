import { Request, Response, NextFunction } from "express";
import ExpenseService from "@tracking/services/ExpenseServices";
import { IAddExpenseParams } from "@shared/params";
import { UserId } from "@shared/primitives";
import { startOfMonth, endOfMonth } from "date-fns";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { MissingFieldError } from "@tracking/errors";

class ExpenseController {
  private expenseService: ExpenseService;

  constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
  }

  async addExpense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId, amount, description, date } = req.body;

      if (!amount || !date) {
        throw new MissingFieldError("Amount, Date are required");
      }

      const params: IAddExpenseParams = {
        userId: UserId(userId),
        amount: Number(amount),
        description: description,
        date: date,
      };

      const newExpense = await this.expenseService.addExpense(params);
      res.status(201).json(newExpense);
      return;
    } catch (error) {
      next(error);
    }
  }

  async getExpenseByUserIdAndMonth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      const { date } = req.body;

      if (!date) {
        throw new MissingFieldError("Date are required");
      }

      const extractedDate = new Date(parseInt(date) * 1000);
      const startDate = startOfMonth(extractedDate);
      const endDate = endOfMonth(extractedDate);

      const expenses = await this.expenseService.getExpenseByUserIdAndMonth(
        UserId(userId),
        startDate,
        endDate
      );
      res.status(200).json(expenses);
    } catch (error) {
      next(error);
    }
  }
}

export default ExpenseController;
