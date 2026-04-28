import { Router } from "express";
import CategoryController from "@tracking/controllers/CategoryController";

class CategoryRoutes {
  private categoryController: CategoryController;

  constructor(categoryController: CategoryController) {
    this.categoryController = categoryController;
  }

  public registerCategoryRoutes(): Router {
    const router = Router();

    router.get(
      "/categories",
      this.categoryController.getCategories.bind(this.categoryController)
    );

    router.post(
      "/categories",
      this.categoryController.createCategory.bind(this.categoryController)
    );

    router.get(
      "/categories/:id",
      this.categoryController.getCategoryById.bind(this.categoryController)
    );

    router.put(
      "/categories/:id",
      this.categoryController.updateCategory.bind(this.categoryController)
    );

    router.delete(
      "/categories/:id",
      this.categoryController.deleteCategory.bind(this.categoryController)
    );

    return router;
  }
}

export default CategoryRoutes;
