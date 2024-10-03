import MonthlyLimitController from "@tracking/controllers/MonthlyLimitController";
import { Router } from "express";

class MonthlyLimitRoutes {
  private monthlyLimitController: MonthlyLimitController;

  constructor(monthlyLimitController: MonthlyLimitController) {
    this.monthlyLimitController = monthlyLimitController;
  }

  public registerMonthlyLimitRoutes(): Router {
    const router = Router();

    router.post(
      "/monthly-limit/add",
      this.monthlyLimitController.addMonthlyLimit.bind(
        this.monthlyLimitController
      )
    );

    router.get(
      "/monthly-limit/:userId",
      this.monthlyLimitController.getMonthlyLimitByUserId.bind(
        this.monthlyLimitController
      )
    );

    return router;
  }
}

export default MonthlyLimitRoutes;