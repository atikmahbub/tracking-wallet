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

export const DEFAULT_INCOME_CATEGORIES = [
  { name: "Salary", icon: "wallet", color: "#4ADE80" },
  { name: "Freelance", icon: "laptop", color: "#22C55E" },
  { name: "Business", icon: "briefcase", color: "#16A34A" },
  { name: "Investment", icon: "chart-line", color: "#15803D" },
  { name: "Gift", icon: "gift", color: "#4ADE80" },
  { name: "Bonus", icon: "sparkles", color: "#22C55E" },
  { name: "Refund", icon: "refresh", color: "#16A34A" },
  { name: "Other", icon: "dots-horizontal", color: "#9CA3AF" },
];

export class IncomeCategoryService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async createDefaultIncomeCategories(userId: string): Promise<void> {
    try {
      const data = DEFAULT_INCOME_CATEGORIES.map((category) => ({
        id: uuidBuffer.toBuffer(v4()),
        name: category.name,
        icon: category.icon,
        color: category.color,
        userId: userId,
      }));

      await this.prisma.incomeCategory.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      console.error(`Error creating default income categories for user ${userId}:`, error);
      // Fail gracefully: do not break user creation if category insert fails
    }
  }

  async seedIncomeCategoriesForAllUsers(): Promise<void> {
    try {
      const users = await this.prisma.user.findMany({
        select: { userId: true },
      });

      console.log(`Seeding default income categories for ${users.length} users...`);

      for (const user of users) {
        // Fetch existing category names for this user to avoid unnecessary insert attempts
        const existingCategories = await this.prisma.incomeCategory.findMany({
          where: { userId: user.userId },
          select: { name: true },
        });

        const existingNames = new Set(existingCategories.map((c) => c.name));
        const categoriesToCreate = DEFAULT_INCOME_CATEGORIES.filter(
          (c) => !existingNames.has(c.name)
        ).map((c) => ({
          id: uuidBuffer.toBuffer(v4()),
          name: c.name,
          icon: c.icon,
          color: c.color,
          userId: user.userId,
        }));

        if (categoriesToCreate.length > 0) {
          await this.prisma.incomeCategory.createMany({
            data: categoriesToCreate,
          });
        }
      }

      console.log("Successfully seeded default income categories for all users.");
    } catch (error) {
      console.error("Error seeding default income categories for all users:", error);
      throw new DatabaseError("Failed to seed default income categories");
    }
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
        orderBy: [
          { userId: "desc" }, // User-specific categories first
          { created: "asc" },
        ],
      });

      // Deduplicate by name, keeping user-specific over global
      const deduplicatedMap = new Map<string, any>();
      categories.forEach(cat => {
        if (!deduplicatedMap.has(cat.name)) {
          deduplicatedMap.set(cat.name, cat);
        }
      });

      return Array.from(deduplicatedMap.values()).map((category) =>
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
