import { Router } from "express";
import SyncController from "@tracking/controllers/SyncController";

class SyncRoutes {
  constructor(private syncController: SyncController) {}

  public registerSyncRoutes(): Router {
    const router = Router();

    router.get(
      "/sync/changes",
      this.syncController.getChanges.bind(this.syncController)
    );

    return router;
  }
}

export default SyncRoutes;
