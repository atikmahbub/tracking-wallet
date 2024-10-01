import { Request, Response, NextFunction } from "express";
import ExpenseService from "@tracking/services/ExpenseServices";
import { ExpenseModel } from "@tracking/models/Expense";
import { IAddExpenseParams } from "@shared/params";
import { UserId, makeUnixTimestampString } from "@shared/primitives";

class ExpenseController {
  private expenseService: ExpenseService;

  constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
  }

  async addExpense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ExpenseModel | void> {
    try {
      const { userId, amount, description, date } = req.params;
      const params: IAddExpenseParams = {
        userId: UserId(userId),
        amount: Number(amount),
        description: description,
        date: makeUnixTimestampString(Number(date)),
      };
      const newExpense = this.expenseService.addExpense(params);
      res.status(201).json(newExpense);
      return newExpense;
    } catch (error) {
      next(error);
    }
  }
}

export default ExpenseController;
