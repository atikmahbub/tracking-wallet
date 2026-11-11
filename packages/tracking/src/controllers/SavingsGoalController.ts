import { SavingsGoalId, UserId } from "@shared/primitives";
import { MissingFieldError } from "@tracking/errors";
import { SavingsGoalService } from "@tracking/services/SavingsGoalService";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import {
  assertOptionalTimestamp,
  assertPositiveAmount,
  assertUuid,
} from "@tracking/utils/ValidationUtils";
import { NextFunction, Request, Response } from "express";

const assertText = (value: unknown, field: string, max: number): void => {
  if (typeof value !== "string" || value.trim() === "" || value.length > max) {
    throw new MissingFieldError(`${field} is invalid`);
  }
};

const assertOptionalBoolean = (value: unknown, field: string): void => {
  if (value !== undefined && typeof value !== "boolean") {
    throw new MissingFieldError(`${field} must be true or false`);
  }
};

export class SavingsGoalController {
  constructor(private savingsGoalService: SavingsGoalService) {}

  async addSavingsGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId, name, icon, target, targetDate, refill, kind } = req.body;
      if (kind !== undefined && kind !== "goal" && kind !== "general") {
        throw new MissingFieldError("kind must be goal or general");
      }
      const general = kind === "general";

      // The general savings pot is the only goal without a target.
      if (!name || !icon || (!general && target === undefined)) {
        throw new MissingFieldError("Fields are missing!");
      }
      assertText(name, "name", 128);
      assertText(icon, "icon", 32);
      if (general) {
        if (target != null || targetDate != null) {
          throw new MissingFieldError("The general savings pot has no target or date");
        }
      } else {
        assertPositiveAmount(target);
      }
      assertOptionalTimestamp(targetDate, "targetDate");
      assertOptionalBoolean(refill, "refill");

      const goal = await this.savingsGoalService.addSavingsGoal({
        userId: UserId(userId),
        name,
        icon,
        target: general ? null : Number(target),
        kind: general ? "general" : "goal",
        targetDate: targetDate ?? null,
        refill: refill === true,
      });
      res.status(201).json(goal);
    } catch (error) {
      next(error);
    }
  }

  async getSavingsGoalsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      const goals = await this.savingsGoalService.getSavingsGoalsByUserId(UserId(userId));
      res.status(200).json(goals);
    } catch (error) {
      next(error);
    }
  }

  async updateSavingsGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const userId = req.body.userId || req.query.userId;
      const { name, icon, target, targetDate, refill, reachedAt } = req.body;

      assertUuid(id, "id");
      if (name !== undefined) assertText(name, "name", 128);
      if (icon !== undefined) assertText(icon, "icon", 32);
      if (target !== undefined) assertPositiveAmount(target);
      assertOptionalTimestamp(targetDate, "targetDate");
      assertOptionalTimestamp(reachedAt, "reachedAt");
      assertOptionalBoolean(refill, "refill");

      const goal = await this.savingsGoalService.updateSavingsGoal({
        id: SavingsGoalId(id),
        userId: UserId(String(userId)),
        name,
        icon,
        target: target === undefined ? undefined : Number(target),
        // absent key stays undefined -> unchanged; explicit null -> clear
        targetDate,
        refill,
        reachedAt,
      });
      res.status(200).json(goal);
    } catch (error) {
      next(error);
    }
  }

  async deleteSavingsGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const userId = req.query.userId || req.body.userId;
      assertUuid(id, "id");
      await this.savingsGoalService.deleteSavingsGoal(
        SavingsGoalId(id),
        UserId(String(userId))
      );
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
