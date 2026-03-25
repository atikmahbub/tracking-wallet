import { Request, Response, NextFunction } from "express";
import CategoryService from "@tracking/services/CategoryService";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { MissingFieldError } from "@tracking/errors";
import { CategoryId, UserId } from "@shared/primitives";
import { ECategoryType } from "@shared/enums";

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
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId, name, icon, color, type } = req.body;

      if (!name || !icon || !color || !type) {
        throw new MissingFieldError("Name, icon, color and type are required");
      }

      const category = await this.categoryService.createCategory({
        userId: this.extractUserId(userId),
        name,
        icon,
        color,
        type: this.parseCategoryType(type),
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
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId, type } = req.query;

      const categories = await this.categoryService.getCategories({
        userId: this.extractUserId(userId),
        type: type ? this.parseCategoryType(type.toString()) : undefined,
      });

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
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const { userId } = req.query;

      if (!id) {
        throw new MissingFieldError("Category id is required");
      }

      const category = await this.categoryService.getCategoryById({
        categoryId: CategoryId(id),
        userId: this.extractUserId(userId),
      });

      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  private parseCategoryType(type: string): ECategoryType {
    const normalized = type.toLowerCase();
    if (normalized === ECategoryType.Expense) {
      return ECategoryType.Expense;
    }
    if (normalized === ECategoryType.Income) {
      return ECategoryType.Income;
    }
    throw new MissingFieldError("Invalid category type");
  }

  private extractUserId(userId: unknown): UserId {
    const parsedUserId = userId?.toString();
    if (!parsedUserId) {
      throw new MissingFieldError("User id is required");
    }
    return UserId(parsedUserId);
  }
}

export default CategoryController;
