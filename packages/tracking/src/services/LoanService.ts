import { LoanType, PrismaClient } from "@prisma/client";
import { LoanModel } from "@shared/models";
import { IAddLoanParams, IUpdateLoanParams } from "@shared/params";
import * as uuiBuffer from "uuid-buffer";
import { v4 } from "uuid";
import {
  LoanId,
  makeUnixTimestampToISOString,
  UserId,
} from "@shared/primitives";
import { DatabaseError } from "@tracking/errors";
import { LoanType as LoanTypeEnum } from "@shared/enums";
import { PresentationService } from "@tracking/utils/presentationService";

export class LoanService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async addLoan(params: IAddLoanParams): Promise<LoanModel> {
    try {
      const { deadLine, amount, name, userId, loanType } = params;
      const newLoan = await this.prisma.loan.create({
        data: {
          id: uuiBuffer.toBuffer(v4()),
          userId: userId,
          name: name,
          amount: amount,
          loanType:
            loanType === LoanTypeEnum.GIVEN ? LoanType.GIVEN : LoanType.TAKEN,
          deadLine: makeUnixTimestampToISOString(Number(deadLine)),
        },
      });
      return this.presentationService.toLoanModel(newLoan);
    } catch (error) {
      console.log("22", error);

      throw new DatabaseError("error in creating the loan");
    }
  }

  async getLoanByUserId(userId: UserId): Promise<LoanModel[]> {
    try {
      const userLoans = await this.prisma.loan.findMany({
        where: {
          userId: userId,
        },
      });

      return userLoans.map((userLoan) =>
        this.presentationService.toLoanModel(userLoan)
      );
    } catch (error) {
      throw new DatabaseError("error in getting the user loans");
    }
  }

  async updateLoan(params: IUpdateLoanParams): Promise<LoanModel> {
    try {
      const { id, amount, name, deadLine } = params;
      const updateLoan = await this.prisma.loan.update({
        where: {
          id: uuiBuffer.toBuffer(id),
        },
        data: {
          name: name,
          amount: amount,
          deadLine: makeUnixTimestampToISOString(Number(deadLine)),
        },
      });

      return this.presentationService.toLoanModel(updateLoan);
    } catch (error) {
      throw new DatabaseError("error in updating the loan");
    }
  }

  async deleteLoan(id: LoanId): Promise<void> {
    try {
      await this.prisma.loan.delete({
        where: {
          id: uuiBuffer.toBuffer(id),
        },
      });
    } catch (error) {
      throw new DatabaseError("error in deleting the loan");
    }
  }
}
