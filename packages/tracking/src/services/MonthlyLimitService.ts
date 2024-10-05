import { PrismaClient } from "@prisma/client";
import {
  IAddMonthlyLimit,
  IGetMonthlyLimitParams,
  IUpdateMonthlyLimitParams,
} from "@shared/params";
import { MonthlyLimitModel } from "@shared/models";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";
import { PresentationService } from "@tracking/utils/presentationService";
import { DatabaseError } from "@tracking/errors";
import { MonthlyLimitId } from "@shared/primitives";

class MonthlyLimitService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async addMonthLimit(params: IAddMonthlyLimit): Promise<MonthlyLimitModel> {
    try {
      const { userId, limit, month, year } = params;
      const newMonthlyLimit = await this.prisma.monthlyLimit.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          userId: userId,
          month: month,
          year: year,
          limit: Number(limit),
        },
      });
      return this.presentationService.toMonthLimitModel(newMonthlyLimit);
    } catch (error) {
      console.log(error);
      throw new DatabaseError("error in creating monthly limit in db");
    }
  }

  async getMonthlyLimitByUserId(
    params: IGetMonthlyLimitParams
  ): Promise<MonthlyLimitModel | null> {
    try {
      const { month, year, userId } = params;

      const monthLimit = await this.prisma.monthlyLimit.findUnique({
        where: {
          user_month_year_unique: {
            userId: userId,
            month: month,
            year: year,
          },
        },
      });

      if (!monthLimit) {
        return null;
      }

      return this.presentationService.toMonthLimitModel(monthLimit);
    } catch (error) {
      throw new DatabaseError("error in getting data for monthly limit");
    }
  }

  async updateMonthlyLimit(
    params: IUpdateMonthlyLimitParams
  ): Promise<MonthlyLimitModel> {
    try {
      const { id, month, year, limit } = params;

      const updatedLimit = await this.prisma.monthlyLimit.update({
        where: {
          id: uuidBuffer.toBuffer(id),
        },
        data: {
          month: month,
          year: year,
          limit: limit,
        },
      });

      return this.presentationService.toMonthLimitModel(updatedLimit);
    } catch (error) {
      console.log("error", error);
      throw new DatabaseError("error in updating the monthly limit");
    }
  }

  async deleteMonthlyLimit(id: MonthlyLimitId): Promise<void> {
    try {
      await this.prisma.monthlyLimit.delete({
        where: {
          id: uuidBuffer.toBuffer(id),
        },
      });
    } catch (error) {
      throw new DatabaseError("error in deleting  monthly limit");
    }
  }
}

export default MonthlyLimitService;
