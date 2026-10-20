import { LoanPaymentController } from "@tracking/controllers/LoanPaymentController";
import { Router } from "express";

class LoanPaymentRoutes {
  private loanPaymentController: LoanPaymentController;

  constructor(loanPaymentController: LoanPaymentController) {
    this.loanPaymentController = loanPaymentController;
  }

  public registerLoanPaymentRoutes(): Router {
    const router = Router();

    router.post(
      "/loan-payment/add",
      this.loanPaymentController.addLoanPayment.bind(this.loanPaymentController)
    );

    router.get(
      "/loan-payment/:userId",
      this.loanPaymentController.getLoanPaymentsByUserId.bind(
        this.loanPaymentController
      )
    );

    router.put(
      "/loan-payment/:id",
      this.loanPaymentController.updateLoanPayment.bind(
        this.loanPaymentController
      )
    );

    router.delete(
      "/loan-payment/:id",
      this.loanPaymentController.deleteLoanPayment.bind(
        this.loanPaymentController
      )
    );

    return router;
  }
}

export default LoanPaymentRoutes;
