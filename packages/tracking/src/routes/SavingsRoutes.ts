import { SavingsEntryController } from "@tracking/controllers/SavingsEntryController";
import { SavingsGoalController } from "@tracking/controllers/SavingsGoalController";
import { Router } from "express";

class SavingsRoutes {
  constructor(
    private goalController: SavingsGoalController,
    private entryController: SavingsEntryController
  ) {}

  public registerSavingsRoutes(): Router {
    const router = Router();
    const g = this.goalController;
    const e = this.entryController;

    router.post("/savings-goal/add", g.addSavingsGoal.bind(g));
    router.get("/savings-goal/:userId", g.getSavingsGoalsByUserId.bind(g));
    router.put("/savings-goal/:id", g.updateSavingsGoal.bind(g));
    router.delete("/savings-goal/:id", g.deleteSavingsGoal.bind(g));

    router.post("/savings-entry/add", e.addSavingsEntry.bind(e));
    router.get("/savings-entry/:userId", e.getSavingsEntriesByUserId.bind(e));
    router.put("/savings-entry/:id", e.updateSavingsEntry.bind(e));
    router.delete("/savings-entry/:id", e.deleteSavingsEntry.bind(e));

    return router;
  }
}

export default SavingsRoutes;
