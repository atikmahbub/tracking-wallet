import { EInvestStatus, PrismaClient } from "@prisma/client";
import { InvestModel } from "@shared/models";
import {
  IAddInvestParams,
  IGetInvestParams,
  IUpdateInvestParams,
} from "@shared/params";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";
import { InvestId, makeUnixTimestampToISOString } from "@shared/primitives";
import { DatabaseError } from "@tracking/errors";
import { PresentationService } from "@tracking/utils/presentationService";
import { EInvestStatus as EInvestStatusEnum } from "@shared/enums";

class InvestService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async addInvest(params: IAddInvestParams): Promise<InvestModel> {
    try {
      const { userId, startDate, endDate, name, note, amount } = params;

      const newInvest = await this.prisma.invest.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          userId: userId,
          name: name,
          note: note,
          amount: amount,
          endDate: endDate
            ? makeUnixTimestampToISOString(Number(endDate))
            : undefined,
          startDate: makeUnixTimestampToISOString(Number(startDate)),
        },
      });

      return this.presentationService.toInvestModel(newInvest);
    } catch (error) {
      console.log("error", error);
      throw new DatabaseError("Error creating invest in database");
    }
  }

  async getInvestByUserId(params: IGetInvestParams): Promise<InvestModel[]> {
    try {
      const { userId, status } = params;
      const userInvest = await this.prisma.invest.findMany({
        where: {
          userId: userId,
          status:
            status === EInvestStatusEnum.Active
              ? EInvestStatus.ACTIVE
              : EInvestStatus.COMPLETED,
        },
      });

      return userInvest.map((invest) =>
        this.presentationService.toInvestModel(invest)
      );
    } catch (error) {
      console.log("error", error);
      throw new DatabaseError("Error getting invest from database");
    }
  }

  async updateInvest(params: IUpdateInvestParams): Promise<InvestModel> {
    try {
      const { id, status, name, amount, startDate, endDate, note, earned } =
        params;
      const updatedInvest = await this.prisma.invest.update({
        where: {
          id: uuidBuffer.toBuffer(id),
        },
        data: {
          status:
            status === EInvestStatusEnum.Active
              ? EInvestStatus.ACTIVE
              : EInvestStatus.COMPLETED,
          name: name,
          amount: amount,
          note: note,
          endDate: endDate
            ? makeUnixTimestampToISOString(Number(endDate))
            : undefined,
          startDate: makeUnixTimestampToISOString(Number(startDate)),
          earned: earned,
        },
      });

      return this.presentationService.toInvestModel(updatedInvest);
    } catch (error) {
      console.log("error", error);
      throw new DatabaseError("Error updating invest in database");
    }
  }

  async deleteInvest(id: InvestId): Promise<void> {
    try {
      await this.prisma.invest.delete({
        where: {
          id: uuidBuffer.toBuffer(id),
        },
      });
    } catch (error) {
      console.log("error", error);
      throw new DatabaseError("Error deleting invest in database");
    }
  }
}

export default InvestService;
