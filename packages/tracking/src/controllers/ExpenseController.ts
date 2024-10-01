import { Request, Response, NextFunction } from "express";
import ExpenseService from "@tracking/services/ExpenseServices";
import { IAddExpenseParams } from "@shared/params";
import { UserId, makeUnixTimestampString } from "@shared/primitives";
import { startOfMonth, endOfMonth } from "date-fns";

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
      const { userId, amount, description, date } = req.body;
      const params: IAddExpenseParams = {
        userId: UserId(userId),
        amount: Number(amount),
        description: description,
        date: makeUnixTimestampString(Number(date)),
      };
      const newExpense = this.expenseService.addExpense(params);
      res.status(201).json(newExpense);
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
      const { userId } = req.params;
      const { date } = req.body;

      if (!date) {
        res.status(400).json({ error: "Date is required in the request body" });
        return;
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
