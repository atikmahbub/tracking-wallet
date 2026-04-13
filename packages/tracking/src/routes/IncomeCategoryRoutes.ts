import { Router } from "express";
import IncomeCategoryController from "@tracking/controllers/IncomeCategoryController";

class IncomeCategoryRoutes {
  private incomeCategoryController: IncomeCategoryController;

  constructor(incomeCategoryController: IncomeCategoryController) {
    this.incomeCategoryController = incomeCategoryController;
  }

  public registerIncomeCategoryRoutes(): Router {
    const router = Router();

    router.get(
      "/income-categories/:userId",
      this.incomeCategoryController.getCategories.bind(this.incomeCategoryController)
    );

    router.post(
      "/income-categories",
      this.incomeCategoryController.createCategory.bind(this.incomeCategoryController)
    );

    router.get(
      "/income-category/:id",
      this.incomeCategoryController.getCategoryById.bind(this.incomeCategoryController)
    );

    return router;
  }
}

export default IncomeCategoryRoutes;
