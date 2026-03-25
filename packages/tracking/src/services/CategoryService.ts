import { PrismaClient, CategoryType } from "@prisma/client";
import { CategoryModel } from "@shared/models";
import {
  ICreateCategoryParams,
  IGetCategoriesParams,
  IGetCategoryByIdParams,
} from "@shared/params";
import { CategoryId, UserId } from "@shared/primitives";
import { PresentationService } from "@tracking/utils/presentationService";
import { DatabaseError, NotFoundError } from "@tracking/errors";
import { ECategoryType } from "@shared/enums";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";

export class CategoryService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async createCategory(
    params: ICreateCategoryParams
  ): Promise<CategoryModel> {
    try {
      const { name, icon, color, type, userId } = params;

      const category = await this.prisma.category.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          name,
          icon,
          color,
          type: this.toPrismaType(type),
          userId,
        },
      });

      return this.presentationService.toCategoryModel(category);
    } catch (error) {
      throw new DatabaseError("Error creating category");
    }
  }

  async getCategories(
    params: IGetCategoriesParams
  ): Promise<CategoryModel[]> {
    try {
      const { userId, type } = params;
      const categories = await this.prisma.category.findMany({
        where: {
          AND: [
            type ? { type: this.toPrismaType(type) } : {},
            {
              OR: [{ userId }, { userId: null }],
            },
          ],
        },
        orderBy: {
          created: "asc",
        },
      });

      return categories.map((category) =>
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
      const { categoryId, userId } = params;

      const category = await this.prisma.category.findFirst({
        where: {
          id: uuidBuffer.toBuffer(categoryId),
          OR: [{ userId }, { userId: null }],
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

  private toPrismaType(type: ECategoryType): CategoryType {
    return type === ECategoryType.Expense
      ? CategoryType.EXPENSE
      : CategoryType.INCOME;
  }
}

export default CategoryService;
