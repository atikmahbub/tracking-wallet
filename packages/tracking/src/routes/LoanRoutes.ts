import { LoanController } from "@tracking/controllers/LoanController";
import { Router } from "express";

class LoanRoutes {
  private loanController: LoanController;

  constructor(loanController: LoanController) {
    this.loanController = loanController;
  }

  public registerLoanRoutes(): Router {
    const router = Router();

    router.post(
      "/loan/add",
      this.loanController.addLoan.bind(this.loanController)
    );

    router.get(
      "/loan/:userId",
      this.loanController.getLoanByUserId.bind(this.loanController)
    );

    router.put(
      "/loan/:id",
      this.loanController.updateLoan.bind(this.loanController)
    );

    router.delete(
      "/loan/:id",
      this.loanController.deleteLoan.bind(this.loanController)
    );

    return router;
  }
}

export default LoanRoutes;
