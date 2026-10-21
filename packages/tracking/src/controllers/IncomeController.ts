import { Request, Response, NextFunction } from "express";
import IncomeService from "@tracking/services/IncomeService";
import { IAddIncomeParams } from "@shared/params";
import { IncomeCategoryId, IncomeId, UserId, RecurringRuleId } from "@shared/primitives";
import { startOfMonth, endOfMonth } from "date-fns";
import { assertRecurringOccurrence } from "@tracking/utils/ValidationUtils";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { MissingFieldError } from "@tracking/errors";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

const timeZone = "Asia/Dhaka";

class IncomeController {
  private incomeService: IncomeService;

  constructor(incomeService: IncomeService) {
    this.incomeService = incomeService;
  }

  async addIncome(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const {
        userId,
        amount,
        description,
        date,
        categoryId,
        recurringRuleId,
        occurrenceDate,
      } = req.body;

      if (!amount || !date) {
        throw new MissingFieldError("Amount, Date are required");
      }
      assertRecurringOccurrence(recurringRuleId, occurrenceDate);

      const params: IAddIncomeParams = {
        userId: UserId(userId),
        amount: Number(amount),
        description: description ?? null,
        date: date,
        categoryId: categoryId ? IncomeCategoryId(categoryId) : undefined,
        recurringRuleId: recurringRuleId ? RecurringRuleId(recurringRuleId) : null,
        occurrenceDate: occurrenceDate ?? null,
      };

      const newIncome = await this.incomeService.addIncome(params);
      res.status(201).json(newIncome);
      return;
    } catch (error) {
      next(error);
    }
  }

  async getIncomeByUserIdAndMonth(
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
      const startDate = fromZonedTime(startOfMonth(extractedDate), timeZone);
      const endDate = fromZonedTime(endOfMonth(extractedDate), timeZone);

      const incomes = await this.incomeService.getIncomeByUserIdAndMonth(
        UserId(userId),
        startDate,
        endDate
      );
      res.status(200).json(incomes);
    } catch (error) {
      next(error);
    }
  }

  async getIncomeAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId, date } = req.query;

      if (!date) {
        throw new MissingFieldError("Date are required");
      }

      const extractedDate = toZonedTime(
        new Date(parseInt(date.toString()) * 1000),
        timeZone
      );
      const startDate = fromZonedTime(startOfMonth(extractedDate), timeZone);
      const endDate = fromZonedTime(endOfMonth(extractedDate), timeZone);

      const analytics = await this.incomeService.getIncomeAnalytics(
        this.extractUserId(userId),
        startDate,
        endDate
      );

      res.status(200).json(analytics);
    } catch (error) {
      next(error);
    }
  }

  async updateIncome(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { amount, date, description, categoryId } = req.body;

      if (!id) {
        throw new MissingFieldError("Id is required!");
      }

      const parsedCategoryId =
        categoryId === undefined
          ? undefined
          : categoryId === null
          ? null
          : IncomeCategoryId(categoryId);

      const updatedIncome = await this.incomeService.updateIncome({
        id: IncomeId(id),
        amount: amount !== undefined ? Number(amount) : undefined,
        date: date,
        description: description,
        categoryId: parsedCategoryId,
      });

      res.status(200).json(updatedIncome);
    } catch (error) {
      next(error);
    }
  }

  async deleteIncome(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new MissingFieldError("id is required");
      }

      await this.incomeService.deleteIncome(IncomeId(id));
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }

  private extractUserId(userId: unknown): UserId {
    const parsed = userId?.toString();
    if (!parsed) {
      throw new MissingFieldError("User id is required");
    }
    return UserId(parsed);
  }
}

export default IncomeController;
