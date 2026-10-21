import { RecurringRuleController } from "@tracking/controllers/RecurringRuleController";
import { Router } from "express";

class RecurringRuleRoutes {
  private recurringRuleController: RecurringRuleController;

  constructor(recurringRuleController: RecurringRuleController) {
    this.recurringRuleController = recurringRuleController;
  }

  public registerRecurringRuleRoutes(): Router {
    const router = Router();

    router.post(
      "/recurring-rule/add",
      this.recurringRuleController.addRecurringRule.bind(this.recurringRuleController)
    );

    router.get(
      "/recurring-rule/:userId",
      this.recurringRuleController.getRecurringRulesByUserId.bind(
        this.recurringRuleController
      )
    );

    router.put(
      "/recurring-rule/:id",
      this.recurringRuleController.updateRecurringRule.bind(
        this.recurringRuleController
      )
    );

    router.delete(
      "/recurring-rule/:id",
      this.recurringRuleController.deleteRecurringRule.bind(
        this.recurringRuleController
      )
    );

    return router;
  }
}

export default RecurringRuleRoutes;
