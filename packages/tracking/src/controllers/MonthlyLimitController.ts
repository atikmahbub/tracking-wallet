import { IAddMonthlyLimit, IGetMonthlyLimitParams } from "@shared/params";
import { Month, MonthlyLimitId, UserId, Year } from "@shared/primitives";
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
      const month = req.query.month;
      const year = req.query.year;

      if (!month || !year) {
        throw new MissingFieldError("Month, Year are required");
      }

      const params: IGetMonthlyLimitParams = {
        userId: UserId(userId),
        month: Number(month) as Month,
        year: Number(year) as Year,
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
        limit: Number(limit),
        month: month,
        year: year,
      });

      res.status(200).json(updatedLimit);
    } catch (error) {
      next(error);
    }
  }

  async deleteMonthlyLimit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new MissingFieldError("id is required!");
      }
      await this.monthlyLimitService.deleteMonthlyLimit(MonthlyLimitId(id));
    } catch (error) {
      next(error);
    }
  }
}

export default MonthlyLimitController;
