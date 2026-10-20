import { LoanId, LoanPaymentId, UserId } from "@shared/primitives";
import { MissingFieldError } from "@tracking/errors";
import { LoanPaymentService } from "@tracking/services/LoanPaymentService";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import {
  assertPositiveAmount,
  assertTimestamp,
  assertUuid,
} from "@tracking/utils/ValidationUtils";
import { NextFunction, Request, Response } from "express";

export class LoanPaymentController {
  private loanPaymentService: LoanPaymentService;
  constructor(loanPaymentService: LoanPaymentService) {
    this.loanPaymentService = loanPaymentService;
  }

  async addLoanPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);

      const { userId, loanId, amount, date, note } = req.body;

      if (!loanId || amount === undefined || date === undefined) {
        throw new MissingFieldError("Fields are missing!");
      }
      assertUuid(loanId, "loanId");
      assertPositiveAmount(amount);
      assertTimestamp(date, "date");

      const newPayment = await this.loanPaymentService.addLoanPayment({
        userId: UserId(userId),
        loanId: LoanId(loanId),
        amount: Number(amount),
        date: date,
        note: note ?? null,
      });

      res.status(201).json(newPayment);
    } catch (error) {
      next(error);
    }
  }

  async getLoanPaymentsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      const payments = await this.loanPaymentService.getLoanPaymentsByUserId(
        UserId(userId)
      );
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }

  async updateLoanPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const userId = req.body.userId || req.query.userId;
      const { amount, date, note } = req.body;

      assertUuid(id, "id");
      if (amount !== undefined) {
        assertPositiveAmount(amount);
      }
      if (date !== undefined) {
        assertTimestamp(date, "date");
      }

      const updatedPayment = await this.loanPaymentService.updateLoanPayment({
        id: LoanPaymentId(id),
        userId: UserId(String(userId)),
        amount: amount === undefined ? undefined : Number(amount),
        date: date,
        note: note,
      });
      res.status(200).json(updatedPayment);
    } catch (error) {
      next(error);
    }
  }

  async deleteLoanPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const userId = req.query.userId || req.body.userId;
      assertUuid(id, "id");

      await this.loanPaymentService.deleteLoanPayment(
        LoanPaymentId(id),
        UserId(String(userId))
      );
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
