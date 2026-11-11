import { PrismaClient } from "@prisma/client";
import { SavingsEntryModel } from "@shared/models";
import {
  IAddSavingsEntryParams,
  IUpdateSavingsEntryParams,
} from "@shared/params";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";
import {
  makeUnixTimestampToISOString,
  SavingsEntryId,
  UserId,
} from "@shared/primitives";
import {
  DatabaseError,
  NotFoundError,
  UnAuthorizedError,
} from "@tracking/errors";
import { PresentationService } from "@tracking/utils/presentationService";
import { recordTombstone } from "@tracking/utils/SyncUtils";

export class SavingsEntryService {
  private presentationService = new PresentationService();

  constructor(private prisma: PrismaClient) {}

  // No "can't withdraw more than saved" rule here: the client checks it
  // against its own copy and the server stores what it is sent.
  async addSavingsEntry(
    params: IAddSavingsEntryParams
  ): Promise<SavingsEntryModel> {
    try {
      const { userId, goalId, amount, date, note } = params;
      const goal = await this.prisma.savingsGoal.findUnique({
        where: { id: uuidBuffer.toBuffer(goalId) },
      });
      if (!goal) {
        throw new NotFoundError("Savings goal not found");
      }
      if (goal.userId !== userId) {
        throw new UnAuthorizedError("Not authorized to modify this savings goal");
      }
      const entry = await this.prisma.savingsEntry.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          goalId: goal.id,
          userId,
          amount,
          date: makeUnixTimestampToISOString(Number(date)),
          note: note ?? null,
        },
      });
      return this.presentationService.toSavingsEntryModel(entry);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in creating the savings entry");
    }
  }

  async getSavingsEntriesByUserId(userId: UserId): Promise<SavingsEntryModel[]> {
    try {
      const entries = await this.prisma.savingsEntry.findMany({
        where: { userId },
        orderBy: { created: "desc" },
      });
      return entries.map((e) => this.presentationService.toSavingsEntryModel(e));
    } catch (error) {
      throw new DatabaseError("error in getting the user savings entries");
    }
  }

  async updateSavingsEntry(
    params: IUpdateSavingsEntryParams
  ): Promise<SavingsEntryModel> {
    try {
      const { id, userId, amount, date, note } = params;
      await this.assertOwnership(id, userId);
      const entry = await this.prisma.savingsEntry.update({
        where: { id: uuidBuffer.toBuffer(id) },
        data: {
          amount,
          date:
            date === undefined
              ? undefined
              : makeUnixTimestampToISOString(Number(date)),
          note,
        },
      });
      return this.presentationService.toSavingsEntryModel(entry);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in updating the savings entry");
    }
  }

  async deleteSavingsEntry(id: SavingsEntryId, userId: UserId): Promise<void> {
    try {
      await this.assertOwnership(id, userId);
      const entryId = uuidBuffer.toBuffer(id);
      await this.prisma.$transaction([
        this.prisma.savingsEntry.delete({ where: { id: entryId } }),
        recordTombstone(this.prisma, "savingsEntry", entryId, userId),
      ]);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in deleting the savings entry");
    }
  }

  private async assertOwnership(id: SavingsEntryId, userId: UserId): Promise<void> {
    const entry = await this.prisma.savingsEntry.findUnique({
      where: { id: uuidBuffer.toBuffer(id) },
    });
    if (!entry) {
      throw new NotFoundError("Savings entry not found");
    }
    if (entry.userId !== userId) {
      throw new UnAuthorizedError("Not authorized to modify this savings entry");
    }
  }
}
