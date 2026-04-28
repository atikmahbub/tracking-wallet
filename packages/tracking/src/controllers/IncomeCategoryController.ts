import { Request, Response, NextFunction } from "express";
import IncomeCategoryService from "@tracking/services/IncomeCategoryService";
import { MissingFieldError } from "@tracking/errors";
import { IncomeCategoryId, UserId } from "@shared/primitives";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";

class IncomeCategoryController {
  private incomeCategoryService: IncomeCategoryService;

  constructor(incomeCategoryService: IncomeCategoryService) {
    this.incomeCategoryService = incomeCategoryService;
  }

  async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { name, icon, color, userId } = req.body;

      if (!name || !icon || !color) {
        throw new MissingFieldError("Name, icon and color are required");
      }

      const category = await this.incomeCategoryService.createCategory({
        name,
        icon,
        color,
        userId: userId ? UserId(userId) : null,
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
      const { userId } = req.params;

      if (!userId) {
        throw new MissingFieldError("User id is required");
      }

      const categories = await this.incomeCategoryService.getCategories({
        userId: UserId(userId),
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
      const { id } = req.params;

      if (!id) {
        throw new MissingFieldError("Category id is required");
      }

      const category = await this.incomeCategoryService.getCategoryById(
        IncomeCategoryId(id)
      );

      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const { name, icon, color, userId } = req.body;

      if (!id) {
        throw new MissingFieldError("Income Category id is required");
      }
      if (!userId) {
        throw new MissingFieldError("User id is required");
      }

      const category = await this.incomeCategoryService.updateCategory({
        incomeCategoryId: IncomeCategoryId(id),
        name,
        icon,
        color,
        userId: UserId(userId),
      });

      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { id } = req.params;
      const userId = req.query.userId || req.body.userId;

      if (!id) {
        throw new MissingFieldError("Income Category id is required");
      }
      if (!userId) {
        throw new MissingFieldError("User id is required");
      }

      await this.incomeCategoryService.deleteCategory(
        IncomeCategoryId(id),
        UserId(userId as string)
      );

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default IncomeCategoryController;
