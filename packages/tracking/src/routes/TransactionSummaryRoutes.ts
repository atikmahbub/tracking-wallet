import { Router } from "express";
import { TransactionSummaryController } from "@tracking/controllers/TransactionSummaryController";

export class TransactionSummaryRoutes {
  private controller: TransactionSummaryController;
  private router: Router;

  constructor(controller: TransactionSummaryController) {
    this.controller = controller;
    this.router = Router();
  }

  public registerRoutes(): Router {
    this.router.get(
      "/transactions/summary/:userId",
      (req, res, next) => this.controller.getMonthlySummary(req, res, next)
    );

    return this.router;
  }
}

export default TransactionSummaryRoutes;
