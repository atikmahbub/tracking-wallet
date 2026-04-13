import { Router } from "express";
import IncomeController from "@tracking/controllers/IncomeController";

class IncomeRouter {
  private incomeController: IncomeController;

  constructor(incomeController: IncomeController) {
    this.incomeController = incomeController;
  }

  public registerIncomeRoutes(): Router {
    const router = Router();

    router.post(
      "/income/add",
      this.incomeController.addIncome.bind(this.incomeController)
    );

    router.get(
      "/income/analytics",
      this.incomeController.getIncomeAnalytics.bind(this.incomeController)
    );

    router.get(
      "/income/:userId",
      this.incomeController.getIncomeByUserIdAndMonth.bind(
        this.incomeController
      )
    );

    router.put(
      "/income/:id",
      this.incomeController.updateIncome.bind(this.incomeController)
    );

    router.delete(
      "/income/:id",
      this.incomeController.deleteIncome.bind(this.incomeController)
    );

    return router;
  }
}

export default IncomeRouter;
