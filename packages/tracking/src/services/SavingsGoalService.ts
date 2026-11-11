import { PrismaClient } from "@prisma/client";
import { SavingsGoalModel } from "@shared/models";
import { IAddSavingsGoalParams, IUpdateSavingsGoalParams } from "@shared/params";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";
import {
  makeUnixTimestampToISOString,
  SavingsGoalId,
  UserId,
} from "@shared/primitives";
import {
  DatabaseError,
  NotFoundError,
  UnAuthorizedError,
} from "@tracking/errors";
import { PresentationService } from "@tracking/utils/presentationService";
import { recordTombstone } from "@tracking/utils/SyncUtils";

const toDate = (value: string | null | undefined): Date | null | undefined =>
  value === undefined
    ? undefined
    : value === null
    ? null
    : new Date(makeUnixTimestampToISOString(Number(value)));

export class SavingsGoalService {
  private presentationService = new PresentationService();

  constructor(private prisma: PrismaClient) {}

  // The offline-first client works out progress and "reached" itself;
  // the server stores what it is sent.
  async addSavingsGoal(params: IAddSavingsGoalParams): Promise<SavingsGoalModel> {
    try {
      const { userId, name, icon, target, targetDate, refill } = params;
      const goal = await this.prisma.savingsGoal.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          userId,
          name,
          icon,
          target,
          targetDate: toDate(targetDate) ?? null,
          refill: refill ?? false,
        },
      });
      return this.presentationService.toSavingsGoalModel(goal);
    } catch (error) {
      throw new DatabaseError("error in creating the savings goal");
    }
  }

  async getSavingsGoalsByUserId(userId: UserId): Promise<SavingsGoalModel[]> {
    try {
      const goals = await this.prisma.savingsGoal.findMany({
        where: { userId },
        orderBy: { created: "desc" },
      });
      return goals.map((g) => this.presentationService.toSavingsGoalModel(g));
    } catch (error) {
      throw new DatabaseError("error in getting the user savings goals");
    }
  }

  async updateSavingsGoal(
    params: IUpdateSavingsGoalParams
  ): Promise<SavingsGoalModel> {
    try {
      const { id, userId, name, icon, target, targetDate, refill, reachedAt } =
        params;
      await this.assertOwnership(id, userId);
      const goal = await this.prisma.savingsGoal.update({
        where: { id: uuidBuffer.toBuffer(id) },
        data: {
          name,
          icon,
          target,
          targetDate: toDate(targetDate),
          refill,
          reachedAt: toDate(reachedAt),
        },
      });
      return this.presentationService.toSavingsGoalModel(goal);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in updating the savings goal");
    }
  }

  async deleteSavingsGoal(id: SavingsGoalId, userId: UserId): Promise<void> {
    try {
      await this.assertOwnership(id, userId);
      const goalId = uuidBuffer.toBuffer(id);
      const entries = await this.prisma.savingsEntry.findMany({
        where: { goalId },
        select: { id: true },
      });
      // Entries go with the goal (cascade); record them so other devices
      // drop them too. Expenses paid from the goal stay, minus the link.
      await this.prisma.$transaction([
        ...entries.map((e) =>
          recordTombstone(this.prisma, "savingsEntry", e.id, userId)
        ),
        this.prisma.expense.updateMany({
          where: { savingsGoalId: goalId },
          data: { savingsGoalId: null },
        }),
        this.prisma.savingsGoal.delete({ where: { id: goalId } }),
        recordTombstone(this.prisma, "savingsGoal", goalId, userId),
      ]);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in deleting the savings goal");
    }
  }

  private async assertOwnership(id: SavingsGoalId, userId: UserId): Promise<void> {
    const goal = await this.prisma.savingsGoal.findUnique({
      where: { id: uuidBuffer.toBuffer(id) },
    });
    if (!goal) {
      throw new NotFoundError("Savings goal not found");
    }
    if (goal.userId !== userId) {
      throw new UnAuthorizedError("Not authorized to modify this savings goal");
    }
  }
}
