import InvestController from "@tracking/controllers/InvestController";
import { Router } from "express";

class InvestRoutes {
  private investController: InvestController;

  constructor(investController: InvestController) {
    this.investController = investController;
  }

  public registerInvestRoutes(): Router {
    const router = Router();

    router.post(
      "/invest/add",
      this.investController.addInvest.bind(this.investController)
    );

    router.get(
      "/invest/:userId",
      this.investController.getInvestByUserId.bind(this.investController)
    );

    router.put(
      "/invest/:id",
      this.investController.updateInvest.bind(this.investController)
    );

    router.delete(
      "/invest/:id",
      this.investController.deleteInvest.bind(this.investController)
    );

    return router;
  }
}

export default InvestRoutes;
