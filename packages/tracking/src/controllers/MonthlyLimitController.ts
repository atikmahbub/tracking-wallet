import { IAddMonthlyLimit, IGetMonthlyLimitParams } from "@shared/params";
import { MonthlyLimitId, UserId } from "@shared/primitives";
import { MissingFieldError } from "@tracking/errors";
import MonthlyLimitService from "@tracking/services/MonthlyLimitService";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { Request, Response, NextFunction } from "express";

class MonthlyLimitController {
  private monthlyLimitService: MonthlyLimitService;

  constructor(monthlyLimitService: MonthlyLimitService) {
    this.monthlyLimitService = monthlyLimitService;
  }

  async addMonthlyLimit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId, limit, month, year } = req.body;

      if (!limit || !month || !year) {
        throw new MissingFieldError("Limit, Month, Year are required");
      }

      const params: IAddMonthlyLimit = {
        userId: UserId(userId),
        month: month,
        year: year,
        limit: limit,
      };
      const newMonthlyLimit = await this.monthlyLimitService.addMonthLimit(
        params
      );
      res.status(201).json(newMonthlyLimit);
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyLimitByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      const { month, year } = req.body;

      if (!month || !year) {
        throw new MissingFieldError("Month, Year are required");
      }

      const params: IGetMonthlyLimitParams = {
        userId: UserId(userId),
        month: month,
        year: year,
      };
      const monthLimit = await this.monthlyLimitService.getMonthlyLimitByUserId(
        params
      );

      res.status(200).json(monthLimit);
    } catch (error) {
      next(error);
    }
  }

  async updateMonthlyLimit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { limit, month, year } = req.body;

      if (!id) {
        throw new MissingFieldError("Id is required!");
      }

      const updatedLimit = await this.monthlyLimitService.updateMonthlyLimit({
        id: MonthlyLimitId(id),
        limit: limit,
        month: month,
        year: year,
      });

      res.status(200).json(updatedLimit);
    } catch (error) {
      next(error);
    }
  }
}

export default MonthlyLimitController;
