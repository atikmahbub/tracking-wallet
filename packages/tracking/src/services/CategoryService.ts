import { PrismaClient } from "@prisma/client";
import { CategoryModel } from "@shared/models";
import {
  ICreateCategoryParams,
  IGetCategoriesParams,
  IGetCategoryByIdParams,
  IUpdateCategoryParams,
} from "@shared/params";
import { PresentationService } from "@tracking/utils/presentationService";
import { DatabaseError, NotFoundError, UnAuthorizedError } from "@tracking/errors";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";
import { CategoryId } from "@shared/primitives";
import { recordTombstone } from "@tracking/utils/SyncUtils";

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: "Food & Dining", icon: "food", color: "#F87171" },
  { name: "Transportation", icon: "car", color: "#60A5FA" },
  { name: "Shopping", icon: "cart", color: "#FBBF24" },
  { name: "Entertainment", icon: "movie", color: "#A78BFA" },
  { name: "Housing", icon: "home", color: "#34D399" },
  { name: "Utilities", icon: "lightning-bolt", color: "#FBBF24" },
  { name: "Health", icon: "medical-bag", color: "#F87171" },
  { name: "Other", icon: "dots-horizontal", color: "#9CA3AF" }
];

export class CategoryService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async createDefaultCategories(userId: string): Promise<void> {
    try {
      const data = DEFAULT_EXPENSE_CATEGORIES.map((category) => ({
        id: uuidBuffer.toBuffer(v4()),
        name: category.name,
        icon: category.icon,
        color: category.color,
        userId: userId,
      }));

      await this.prisma.category.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      console.error(`Error creating default categories for user ${userId}:`, error);
    }
  }


  async createCategory(
    params: ICreateCategoryParams
  ): Promise<CategoryModel> {
    try {
      const { name, icon, color, userId } = params;

      if (!userId) {
        throw new Error("userId is required to create a category");
      }

      const category = await this.prisma.category.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          name,
          icon,
          color,
          userId: userId,
        },
      });

      return this.presentationService.toCategoryModel(category);
    } catch (error) {
      throw new DatabaseError("Error creating category");
    }
  }

  async getCategories(params: IGetCategoriesParams): Promise<CategoryModel[]> {
    try {
      const { userId } = params;
      const categories = await this.prisma.category.findMany({
        where: {
          OR: [
            { userId: userId },
            { userId: null },
          ],
        },
        orderBy: [
          { userId: "desc" }, // User-specific categories first (non-null > null)
          { created: "asc" },
        ],
      });

      // Deduplicate by name, keeping the first one encountered (which will be user-specific if it exists)
      const deduplicatedMap = new Map<string, any>();
      categories.forEach(cat => {
        if (!deduplicatedMap.has(cat.name)) {
          deduplicatedMap.set(cat.name, cat);
        }
      });

      return Array.from(deduplicatedMap.values()).map((category) =>
        this.presentationService.toCategoryModel(category)
      );
    } catch (error) {
      throw new DatabaseError("Error fetching categories");
    }
  }

  async getCategoryById(
    params: IGetCategoryByIdParams
  ): Promise<CategoryModel> {
    try {
      const { categoryId } = params;

      const category = await this.prisma.category.findUnique({
        where: {
          id: uuidBuffer.toBuffer(categoryId),
        },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      return this.presentationService.toCategoryModel(category);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error fetching category");
    }
  }

  async updateCategory(params: IUpdateCategoryParams): Promise<CategoryModel> {
    try {
      const { categoryId, name, icon, color, userId } = params;

      const categoryIdBuffer = uuidBuffer.toBuffer(categoryId);

      const existingCategory = await this.prisma.category.findUnique({
        where: { id: categoryIdBuffer },
      });

      if (!existingCategory) {
        throw new NotFoundError("Category not found");
      }

      if (existingCategory.userId !== userId) {
        throw new UnAuthorizedError("Not authorized to update this category");
      }

      const updated = await this.prisma.category.update({
        where: {
          id: categoryIdBuffer,
        },
        data: {
          name,
          icon,
          color,
        },
      });

      return this.presentationService.toCategoryModel(updated);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("Error updating category");
    }
  }

  async deleteCategory(categoryId: CategoryId, userId: string): Promise<void> {
    try {
      const categoryIdBuffer = uuidBuffer.toBuffer(categoryId);

      const existingCategory = await this.prisma.category.findUnique({
        where: { id: categoryIdBuffer },
      });

      if (!existingCategory) {
        throw new NotFoundError("Category not found");
      }

      if (existingCategory.userId !== userId) {
        throw new UnAuthorizedError("Not authorized to delete this category");
      }

      // The FK nulls expenses' categoryId, but without touching `updated`;
      // do it here so the delta sync carries the change to other devices.
      // Recurring rules hold the id without a FK, so clear those too.
      const now = new Date();
      await this.prisma.$transaction([
        this.prisma.expense.updateMany({
          where: { categoryId: categoryIdBuffer },
          data: { categoryId: null, updated: now },
        }),
        this.prisma.recurringRule.updateMany({
          where: { userId, type: "expense", categoryId: categoryIdBuffer },
          data: { categoryId: null, updated: now },
        }),
        this.prisma.category.delete({ where: { id: categoryIdBuffer } }),
        recordTombstone(this.prisma, "category", categoryIdBuffer, userId),
      ]);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
        throw error;
      }
      throw new DatabaseError("Error deleting category");
    }
  }
}

export default CategoryService;
