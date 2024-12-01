import { Request, Response, NextFunction } from "express";
import ExpenseService from "@tracking/services/ExpenseServices";
import { IAddExpenseParams } from "@shared/params";
import { ExpenseId, Month, UserId, Year } from "@shared/primitives";
import { startOfMonth, endOfMonth } from "date-fns";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { MissingFieldError } from "@tracking/errors";
import { toZonedTime } from "date-fns-tz";
import MonthlyLimitService from "@tracking/services/MonthlyLimitService";
import { PrismaClient } from "@prisma/client";

const timeZone = "Asia/Dhaka";
const prisma = new PrismaClient();
class ExpenseController {
  private expenseService: ExpenseService;
  private monthlyLimitService: MonthlyLimitService;

  constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
    this.monthlyLimitService = new MonthlyLimitService(prisma);
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
      const date = req.query.date;

      if (!date) {
        throw new MissingFieldError("Date are required");
      }

      const extractedDate = toZonedTime(
        new Date(parseInt(date.toString()) * 1000),
        timeZone
      );
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

  async updateExpense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { amount, date, description } = req.body;

      if (!id) {
        throw new MissingFieldError("Id is required!");
      }

      const updatedExpense = await this.expenseService.updateExpense({
        id: ExpenseId(id),
        amount: Number(amount),
        date: date,
        description: description,
      });

      res.status(200).json(updatedExpense);
    } catch (error) {
      next(error);
    }
  }

  async deleteExpense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new MissingFieldError("id is required");
      }

      await this.expenseService.deleteExpense(ExpenseId(id));
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }

  async exceedExpenseNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      if (!userId) {
        throw new MissingFieldError("User id is required");
      }
      const extractedDate = toZonedTime(new Date(), timeZone);
      const startDate = startOfMonth(extractedDate);
      const endDate = endOfMonth(extractedDate);

      const expenses = await this.expenseService.getExpenseByUserIdAndMonth(
        UserId(userId),
        startDate,
        endDate
      );

      const totalExpense = expenses.reduce((acc, crr) => {
        acc += crr.amount;
        return acc;
      }, 0);

      const monthlyLimit =
        await this.monthlyLimitService.getMonthlyLimitByUserId({
          userId: UserId(userId),
          month: (new Date().getMonth() + 1) as Month,
          year: new Date().getFullYear() as Year,
        });

      const isExceeded = monthlyLimit
        ? totalExpense > monthlyLimit.limit
        : false;

      res.json(isExceeded);
    } catch (error) {
      next(error);
    }
  }
}

export default ExpenseController;
