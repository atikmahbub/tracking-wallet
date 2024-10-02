import { PrismaClient } from "@prisma/client";
import { IAddMonthlyLimit, IGetMonthlyLimitParams } from "@shared/params";
import { MonthlyLimitModel } from "@tracking/models/MonthlyLimit";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";
import { PresentationService } from "@tracking/utils/presentationService";
import { DatabaseError } from "@tracking/errors";

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
}

export default MonthlyLimitService;
