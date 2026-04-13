import { Router } from "express";
import TransactionController from "@tracking/controllers/TransactionController";

class TransactionRoutes {
  private transactionController: TransactionController;

  constructor(transactionController: TransactionController) {
    this.transactionController = transactionController;
  }

  public registerTransactionRoutes(): Router {
    const router = Router();

    router.get(
      "/transactions",
      this.transactionController.getTransactions.bind(this.transactionController)
    );

    return router;
  }
}

export default TransactionRoutes;
