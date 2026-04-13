import { PrismaClient } from "@prisma/client";
import { IncomeCategoryModel } from "@shared/models";
import {
  ICreateIncomeCategoryParams,
  IGetIncomeCategoriesParams,
} from "@shared/params";
import { PresentationService } from "@tracking/utils/presentationService";
import { DatabaseError, NotFoundError } from "@tracking/errors";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";
import { IncomeCategoryId } from "@shared/primitives";

export class IncomeCategoryService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async createCategory(
    params: ICreateIncomeCategoryParams
  ): Promise<IncomeCategoryModel> {
    try {
      const { name, icon, color, userId } = params;

      const category = await this.prisma.incomeCategory.create({
        data: {
          id: uuidBuffer.toBuffer(v4()),
          name,
          icon,
          color,
          userId: userId ?? null,
        },
      });

      return this.presentationService.toIncomeCategoryModel(category);
    } catch (error) {
      throw new DatabaseError("Error creating income category");
    }
  }

  async getCategories(params: IGetIncomeCategoriesParams): Promise<IncomeCategoryModel[]> {
    try {
      const { userId } = params;
      const categories = await this.prisma.incomeCategory.findMany({
        where: {
          OR: [
            { userId: userId },
            { userId: null },
          ],
        },
        orderBy: {
          created: "asc",
        },
      });

      return categories.map((category) =>
        this.presentationService.toIncomeCategoryModel(category)
      );
    } catch (error) {
      throw new DatabaseError("Error fetching income categories");
    }
  }

  async getCategoryById(
    categoryId: IncomeCategoryId
  ): Promise<IncomeCategoryModel> {
    try {
      const category = await this.prisma.incomeCategory.findUnique({
        where: {
          id: uuidBuffer.toBuffer(categoryId),
        },
      });

      if (!category) {
        throw new NotFoundError("Income Category not found");
      }

      return this.presentationService.toIncomeCategoryModel(category);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error fetching income category");
    }
  }
}

export default IncomeCategoryService;
