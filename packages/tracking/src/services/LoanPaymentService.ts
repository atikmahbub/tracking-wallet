import { PrismaClient } from "@prisma/client";
import { LoanPaymentModel } from "@shared/models";
import {
  IAddLoanPaymentParams,
  IUpdateLoanPaymentParams,
} from "@shared/params";
import * as uuiBuffer from "uuid-buffer";
import { v4 } from "uuid";
import {
  LoanPaymentId,
  makeUnixTimestampToISOString,
  UserId,
} from "@shared/primitives";
import {
  DatabaseError,
  NotFoundError,
  UnAuthorizedError,
} from "@tracking/errors";
import { PresentationService } from "@tracking/utils/presentationService";
import { recordTombstone } from "@tracking/utils/SyncUtils";

export class LoanPaymentService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  // No balance or settlement rules here: the offline-first client decides
  // both locally and the server stores what it is sent.
  async addLoanPayment(
    params: IAddLoanPaymentParams
  ): Promise<LoanPaymentModel> {
    try {
      const { userId, loanId, amount, date, note } = params;

      const loan = await this.prisma.loan.findUnique({
        where: { id: uuiBuffer.toBuffer(loanId) },
      });
      if (!loan) {
        throw new NotFoundError("Loan not found");
      }
      if (loan.userId !== userId) {
        throw new UnAuthorizedError("Not authorized to modify this loan");
      }

      const newPayment = await this.prisma.loanPayment.create({
        data: {
          id: uuiBuffer.toBuffer(v4()),
          loanId: loan.id,
          userId: userId,
          amount: amount,
          date: makeUnixTimestampToISOString(Number(date)),
          note: note ?? null,
        },
      });
      return this.presentationService.toLoanPaymentModel(newPayment);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in creating the loan payment");
    }
  }

  async getLoanPaymentsByUserId(userId: UserId): Promise<LoanPaymentModel[]> {
    try {
      const payments = await this.prisma.loanPayment.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          created: "desc",
        },
      });

      return payments.map((payment) =>
        this.presentationService.toLoanPaymentModel(payment)
      );
    } catch (error) {
      throw new DatabaseError("error in getting the user loan payments");
    }
  }

  async updateLoanPayment(
    params: IUpdateLoanPaymentParams
  ): Promise<LoanPaymentModel> {
    try {
      const { id, userId, amount, date, note } = params;
      await this.assertOwnership(id, userId);

      const updatedPayment = await this.prisma.loanPayment.update({
        where: {
          id: uuiBuffer.toBuffer(id),
        },
        data: {
          amount: amount,
          date:
            date === undefined
              ? undefined
              : makeUnixTimestampToISOString(Number(date)),
          note: note,
        },
      });

      return this.presentationService.toLoanPaymentModel(updatedPayment);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in updating the loan payment");
    }
  }

  async deleteLoanPayment(id: LoanPaymentId, userId: UserId): Promise<void> {
    try {
      await this.assertOwnership(id, userId);
      const paymentId = uuiBuffer.toBuffer(id);
      await this.prisma.$transaction([
        this.prisma.loanPayment.delete({ where: { id: paymentId } }),
        recordTombstone(this.prisma, "loanPayment", paymentId, userId),
      ]);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("error in deleting the loan payment");
    }
  }

  private async assertOwnership(
    id: LoanPaymentId,
    userId: UserId
  ): Promise<void> {
    const payment = await this.prisma.loanPayment.findUnique({
      where: { id: uuiBuffer.toBuffer(id) },
      include: { loan: true },
    });
    if (!payment) {
      throw new NotFoundError("Loan payment not found");
    }
    if (payment.userId !== userId || payment.loan.userId !== userId) {
      throw new UnAuthorizedError("Not authorized to modify this loan payment");
    }
  }
}
