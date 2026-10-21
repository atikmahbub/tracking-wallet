import { RecurringRuleId, UserId } from "@shared/primitives";
import { MissingFieldError } from "@tracking/errors";
import { RecurringRuleService } from "@tracking/services/RecurringRuleService";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import {
  assertOneOf,
  assertOptionalTimestamp,
  assertOptionalUuid,
  assertPositiveAmount,
  assertTimestamp,
  assertUuid,
} from "@tracking/utils/ValidationUtils";
import { NextFunction, Request, Response } from "express";

const TYPES = ["expense", "income"] as const;
const FREQUENCIES = ["weekly", "monthly", "yearly"] as const;

export class RecurringRuleController {
  private recurringRuleService: RecurringRuleService;
  constructor(recurringRuleService: RecurringRuleService) {
    this.recurringRuleService = recurringRuleService;
  }

  async addRecurringRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);

      const {
        userId,
        type,
        amount,
        description,
        categoryId,
        frequency,
        startDate,
        endDate,
        pausedAt,
        lastRunDate,
      } = req.body;

      if (!type || amount === undefined || !frequency || startDate === undefined) {
        throw new MissingFieldError("Fields are missing!");
      }
      assertOneOf(type, TYPES, "type");
      assertOneOf(frequency, FREQUENCIES, "frequency");
      assertPositiveAmount(amount);
      assertTimestamp(startDate, "startDate");
      assertOptionalTimestamp(endDate, "endDate");
      assertOptionalTimestamp(pausedAt, "pausedAt");
      assertOptionalTimestamp(lastRunDate, "lastRunDate");
      assertOptionalUuid(categoryId, "categoryId");

      const rule = await this.recurringRuleService.addRecurringRule({
        userId: UserId(userId),
        type,
        amount: Number(amount),
        description: description ?? null,
        categoryId: categoryId ?? null,
        frequency,
        startDate,
        endDate: endDate ?? null,
        pausedAt: pausedAt ?? null,
        lastRunDate: lastRunDate ?? null,
      });

      res.status(201).json(rule);
    } catch (error) {
      next(error);
    }
  }

  async getRecurringRulesByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      const rules = await this.recurringRuleService.getRecurringRulesByUserId(
        UserId(userId)
      );
      res.status(200).json(rules);
    } catch (error) {
      next(error);
    }
  }

  async updateRecurringRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const userId = req.body.userId || req.query.userId;
      const {
        amount,
        description,
        categoryId,
        frequency,
        startDate,
        endDate,
        pausedAt,
        lastRunDate,
      } = req.body;

      assertUuid(id, "id");
      if (amount !== undefined) assertPositiveAmount(amount);
      if (frequency !== undefined) assertOneOf(frequency, FREQUENCIES, "frequency");
      if (startDate !== undefined) assertTimestamp(startDate, "startDate");
      assertOptionalTimestamp(endDate, "endDate");
      assertOptionalTimestamp(pausedAt, "pausedAt");
      assertOptionalTimestamp(lastRunDate, "lastRunDate");
      assertOptionalUuid(categoryId, "categoryId");

      const rule = await this.recurringRuleService.updateRecurringRule({
        id: RecurringRuleId(id),
        userId: UserId(String(userId)),
        amount: amount === undefined ? undefined : Number(amount),
        description,
        categoryId,
        frequency,
        startDate,
        endDate,
        pausedAt,
        lastRunDate,
      });
      res.status(200).json(rule);
    } catch (error) {
      next(error);
    }
  }

  async deleteRecurringRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const userId = req.query.userId || req.body.userId;
      assertUuid(id, "id");

      await this.recurringRuleService.deleteRecurringRule(
        RecurringRuleId(id),
        UserId(String(userId))
      );
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
