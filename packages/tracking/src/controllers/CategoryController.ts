import { Request, Response, NextFunction } from "express";
import CategoryService from "@tracking/services/CategoryService";
import { MissingFieldError } from "@tracking/errors";
import { CategoryId } from "@shared/primitives";

class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, icon, color } = req.body;

      if (!name || !icon || !color) {
        throw new MissingFieldError("Name, icon and color are required");
      }

      const category = await this.categoryService.createCategory({
        name,
        icon,
        color,
      });

      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await this.categoryService.getCategories();

      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new MissingFieldError("Category id is required");
      }

      const category = await this.categoryService.getCategoryById({
        categoryId: CategoryId(id),
      });

      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

}

export default CategoryController;
