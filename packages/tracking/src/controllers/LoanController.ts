import { LoanModel } from "@shared/models";
import { LoanId, UserId } from "@shared/primitives";
import { MissingFieldError } from "@tracking/errors";
import { LoanService } from "@tracking/services/LoanService";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { NextFunction, Request, Response } from "express";

export class LoanController {
  private loanService: LoanService;
  constructor(loanService: LoanService) {
    this.loanService = loanService;
  }

  async addLoan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);

      const { userId, name, amount, deadLine, loanType } = req.body;

      if (!name || !amount || !deadLine || !loanType) {
        throw new MissingFieldError("Fields are missing!");
      }

      const newLoan = await this.loanService.addLoan({
        userId: userId,
        name: name,
        amount: amount,
        deadLine: deadLine,
        loanType: loanType,
      });

      res.status(201).json(newLoan);
    } catch (error) {
      next(error);
    }
  }

  async getLoanByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      const userLoans = await this.loanService.getLoanByUserId(UserId(userId));
      res.status(201).json(userLoans);
    } catch (error) {
      next(error);
    }
  }

  async updateLoan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, amount, deadLine } = req.body;

      const updateLoan = await this.loanService.updateLoan({
        id: LoanId(id),
        name: name,
        amount: amount,
        deadLine: deadLine,
      });
      res.status(201).json(updateLoan);
    } catch (error) {
      next(error);
    }
  }

  async deleteLoan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      await this.loanService.deleteLoan(LoanId(id));
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
