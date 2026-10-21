import { PrismaClient } from "@prisma/client";
import { RecurringRuleModel } from "@shared/models";
import {
  IAddRecurringRuleParams,
  IUpdateRecurringRuleParams,
} from "@shared/params";
import * as uuiBuffer from "uuid-buffer";
import { v4 } from "uuid";
import {
  makeUnixTimestampToISOString,
  RecurringRuleId,
  UserId,
} from "@shared/primitives";
import {
  DatabaseError,
  NotFoundError,
  UnAuthorizedError,
} from "@tracking/errors";
import { PresentationService } from "@tracking/utils/presentationService";

const toDate = (value: string) => makeUnixTimestampToISOString(Number(value));
// undefined = leave unchanged, null = clear
const toOptionalDate = (value: string | null | undefined) =>
  value === undefined ? undefined : value === null ? null : toDate(value);

export class RecurringRuleService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  // No scheduling here: the offline-first client decides which occurrences are
  // due and stores the cursor (lastRunDate) it reached.
  async addRecurringRule(
    params: IAddRecurringRuleParams
  ): Promise<RecurringRuleModel> {
    try {
      const rule = await this.prisma.recurringRule.create({
        data: {
          id: uuiBuffer.toBuffer(v4()),
          userId: params.userId,
          type: params.type,
          amount: params.amount,
          description: params.description ?? null,
          categoryId: params.categoryId
            ? uuiBuffer.toBuffer(params.categoryId)
            : null,
          frequency: params.frequency,
          startDate: toDate(params.startDate),
          endDate: toOptionalDate(params.endDate) ?? null,
          pausedAt: toOptionalDate(params.pausedAt) ?? null,
          lastRunDate: toOptionalDate(params.lastRunDate) ?? null,
        },
      });
      return this.presentationService.toRecurringRuleModel(rule);
    } catch (error) {
      throw new DatabaseError("error in creating the recurring rule");
    }
  }

  async getRecurringRulesByUserId(
    userId: UserId
  ): Promise<RecurringRuleModel[]> {
    try {
      const rules = await this.prisma.recurringRule.findMany({
        where: { userId: userId },
        orderBy: { created: "desc" },
      });
      return rules.map((rule) =>
        this.presentationService.toRecurringRuleModel(rule)
      );
    } catch (error) {
      throw new DatabaseError("error in getting the user recurring rules");
    }
  }

  async updateRecurringRule(
    params: IUpdateRecurringRuleParams
  ): Promise<RecurringRuleModel> {
    try {
      const { id, userId } = params;
      await this.assertOwnership(id, userId);

      const rule = await this.prisma.recurringRule.update({
        where: { id: uuiBuffer.toBuffer(id) },
        data: {
          amount: params.amount,
          description: params.description,
          categoryId:
            params.categoryId === undefined
              ? undefined
              : params.categoryId === null
                ? null
                : uuiBuffer.toBuffer(params.categoryId),
          frequency: params.frequency,
          startDate:
            params.startDate === undefined ? undefined : toDate(params.startDate),
          endDate: toOptionalDate(params.endDate),
          pausedAt: toOptionalDate(params.pausedAt),
          lastRunDate: toOptionalDate(params.lastRunDate),
        },
      });
      return this.presentationService.toRecurringRuleModel(rule);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in updating the recurring rule");
    }
  }

  // Entries the rule already added stay; only the rule goes.
  async deleteRecurringRule(id: RecurringRuleId, userId: UserId): Promise<void> {
    try {
      await this.assertOwnership(id, userId);
      await this.prisma.recurringRule.delete({
        where: { id: uuiBuffer.toBuffer(id) },
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in deleting the recurring rule");
    }
  }

  private async assertOwnership(
    id: RecurringRuleId,
    userId: UserId
  ): Promise<void> {
    const rule = await this.prisma.recurringRule.findUnique({
      where: { id: uuiBuffer.toBuffer(id) },
    });
    if (!rule) {
      throw new NotFoundError("Recurring rule not found");
    }
    if (rule.userId !== userId) {
      throw new UnAuthorizedError("Not authorized to modify this recurring rule");
    }
  }
}
