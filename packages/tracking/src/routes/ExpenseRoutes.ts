import { Router } from "express";
import ExpenseController from "@tracking/controllers/ExpenseController";

class ExpenseRouter {
  private expenseController: ExpenseController;

  constructor(expenseController: ExpenseController) {
    this.expenseController = expenseController;
  }

  public registerExpenseRoutes(): Router {
    const router = Router();

    router.post(
      "/expense/add",
      this.expenseController.addExpense.bind(this.expenseController)
    );

    return router;
  }
}

export default ExpenseRouter;
