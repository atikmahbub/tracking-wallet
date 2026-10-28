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
import { DatabaseError, NotFoundError } from "@tracking/errors";
import { LoanType as LoanTypeEnum } from "@shared/enums";
import { PresentationService } from "@tracking/utils/presentationService";
import { recordTombstone } from "@tracking/utils/SyncUtils";

export class LoanService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async addLoan(params: IAddLoanParams): Promise<LoanModel> {
    try {
      const { deadLine, amount, name, userId, loanType, note, settledAt, countInBalance } =
        params;
      const newLoan = await this.prisma.loan.create({
        data: {
          id: uuiBuffer.toBuffer(v4()),
          userId: userId,
          name: name,
          amount: amount,
          loanType:
            loanType === LoanTypeEnum.GIVEN ? LoanType.GIVEN : LoanType.TAKEN,
          deadLine: makeUnixTimestampToISOString(Number(deadLine)),
          note: note,
          settledAt: settledAt
            ? makeUnixTimestampToISOString(Number(settledAt))
            : null,
          countInBalance: countInBalance ?? false,
        },
      });
      return this.presentationService.toLoanModel(newLoan);
    } catch (error) {
      throw new DatabaseError("error in creating the loan");
    }
  }

  async getLoanByUserId(userId: UserId): Promise<LoanModel[]> {
    try {
      const userLoans = await this.prisma.loan.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          created: "desc",
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
      const { id, amount, name, deadLine, note, settledAt, countInBalance } =
        params;
      const updateLoan = await this.prisma.loan.update({
        where: {
          id: uuiBuffer.toBuffer(id),
        },
        data: {
          name: name,
          amount: amount,
          deadLine: makeUnixTimestampToISOString(Number(deadLine)),
          note: note,
          // undefined leaves the column untouched (old clients never send it)
          settledAt:
            settledAt === undefined
              ? undefined
              : settledAt === null
              ? null
              : makeUnixTimestampToISOString(Number(settledAt)),
          countInBalance: countInBalance,
        },
      });

      return this.presentationService.toLoanModel(updateLoan);
    } catch (error) {
      throw new DatabaseError("error in updating the loan");
    }
  }

  async deleteLoan(id: LoanId): Promise<void> {
    try {
      const loanId = uuiBuffer.toBuffer(id);
      const row = await this.prisma.loan.findUnique({
        where: { id: loanId },
        include: { payments: { select: { id: true } } },
      });
      if (!row) {
        throw new NotFoundError("Loan not found");
      }
      // Payments go with the loan (cascade); record them too so other
      // devices drop them as well.
      await this.prisma.$transaction([
        ...row.payments.map((p) =>
          recordTombstone(this.prisma, "loanPayment", p.id, row.userId)
        ),
        this.prisma.loan.delete({ where: { id: loanId } }),
        recordTombstone(this.prisma, "loan", loanId, row.userId),
      ]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("error in deleting the loan");
    }
  }
}
