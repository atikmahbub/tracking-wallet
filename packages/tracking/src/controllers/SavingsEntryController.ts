import { SavingsEntryId, SavingsGoalId, UserId } from "@shared/primitives";
import { MissingFieldError } from "@tracking/errors";
import { SavingsEntryService } from "@tracking/services/SavingsEntryService";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import {
  assertNonZeroAmount,
  assertTimestamp,
  assertUuid,
} from "@tracking/utils/ValidationUtils";
import { NextFunction, Request, Response } from "express";

export class SavingsEntryController {
  constructor(private savingsEntryService: SavingsEntryService) {}

  async addSavingsEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId, goalId, amount, date, note } = req.body;

      if (!goalId || amount === undefined || date === undefined) {
        throw new MissingFieldError("Fields are missing!");
      }
      assertUuid(goalId, "goalId");
      assertNonZeroAmount(amount);
      assertTimestamp(date, "date");

      const entry = await this.savingsEntryService.addSavingsEntry({
        userId: UserId(userId),
        goalId: SavingsGoalId(goalId),
        amount: Number(amount),
        date,
        note: note ?? null,
      });
      res.status(201).json(entry);
    } catch (error) {
      next(error);
    }
  }

  async getSavingsEntriesByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      const entries = await this.savingsEntryService.getSavingsEntriesByUserId(UserId(userId));
      res.status(200).json(entries);
    } catch (error) {
      next(error);
    }
  }

  async updateSavingsEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const userId = req.body.userId || req.query.userId;
      const { amount, date, note } = req.body;

      assertUuid(id, "id");
      if (amount !== undefined) assertNonZeroAmount(amount);
      if (date !== undefined) assertTimestamp(date, "date");

      const entry = await this.savingsEntryService.updateSavingsEntry({
        id: SavingsEntryId(id),
        userId: UserId(String(userId)),
        amount: amount === undefined ? undefined : Number(amount),
        date,
        note,
      });
      res.status(200).json(entry);
    } catch (error) {
      next(error);
    }
  }

  async deleteSavingsEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const userId = req.query.userId || req.body.userId;
      assertUuid(id, "id");
      await this.savingsEntryService.deleteSavingsEntry(
        SavingsEntryId(id),
        UserId(String(userId))
      );
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
