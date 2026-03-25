import { PrismaClient } from "@prisma/client";
import { CategoryModel } from "@shared/models";
import {
  ICreateCategoryParams,
  IGetCategoryByIdParams,
} from "@shared/params";
import { PresentationService } from "@tracking/utils/presentationService";
import { DatabaseError, NotFoundError } from "@tracking/errors";
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
      const { name, icon, color } = params;

      const category = await this.prisma.category.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          name,
          icon,
          color,
        },
      });

      return this.presentationService.toCategoryModel(category);
    } catch (error) {
      throw new DatabaseError("Error creating category");
    }
  }

  async getCategories(): Promise<CategoryModel[]> {
    try {
      const categories = await this.prisma.category.findMany({
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
}

export default CategoryService;
