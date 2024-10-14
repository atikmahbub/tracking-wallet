import InvestService from "@tracking/services/InvestService";
import { NextFunction, Request, Response } from "express";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { MissingFieldError } from "@tracking/errors";
import {
  IAddInvestParams,
  IGetInvestParams,
  IUpdateInvestParams,
} from "@shared/params";
import { InvestId, UserId } from "@shared/primitives";
import { EInvestStatus } from "@shared/enums/InvestStatus";

class InvestController {
  private investService: InvestService;

  constructor(investService: InvestService) {
    this.investService = investService;
  }

  async addInvest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { name, amount, note, startDate, endDate, userId } = req.body;

      if (!name || !amount || !note || !startDate) {
        throw new MissingFieldError("some fields are missing");
      }

      const params: IAddInvestParams = {
        userId: userId,
        amount: Number(amount),
        name: name,
        note: note,
        endDate: endDate,
        startDate: startDate,
      };

      const addInvest = await this.investService.addInvest(params);
      res.status(201).json(addInvest);
    } catch (error) {
      next(error);
    }
  }

  async getInvestByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      const status = req.query.status;

      if (!status) {
        throw new MissingFieldError("Status is missing");
      }

      const params: IGetInvestParams = {
        userId: UserId(userId),
        status:
          Number(status) === EInvestStatus.Active
            ? EInvestStatus.Active
            : EInvestStatus.Completed,
      };

      const investList = await this.investService.getInvestByUserId(params);
      res.status(200).json(investList);
    } catch (error) {
      next(error);
    }
  }

  async updateInvest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { amount, name, note, status, earned, endDate, startDate } =
        req.body;

      const params: IUpdateInvestParams = {
        id: InvestId(id),
        amount: Number(amount),
        name: name,
        note: note,
        startDate: startDate,
        endDate: endDate,
        status: status,
        earned: Number(earned),
      };

      const updatedInvest = await this.investService.updateInvest(params);
      res.status(200).json(updatedInvest);
    } catch (error) {
      next(error);
    }
  }

  async deleteInvest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      await this.investService.deleteInvest(InvestId(id));
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}

export default InvestController;
