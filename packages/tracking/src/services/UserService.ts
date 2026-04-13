import { PrismaClient } from "@prisma/client";
import { IAddUserParams, IUpdateUserParams } from "@shared/params";
import { UserId } from "@shared/primitives";
import { DatabaseError } from "@tracking/errors";
import { UserModel } from "@shared/models";
import { PresentationService } from "@tracking/utils/presentationService";
import { IncomeCategoryService } from "./IncomeCategoryService";

class UserService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;
  private incomeCategoryService: IncomeCategoryService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
    this.incomeCategoryService = new IncomeCategoryService(prisma);
  }

  async addUser(params: IAddUserParams): Promise<UserModel> {
    try {
      const { userId, name, email, profilePicture } = params;

      const existingUser = await this.prisma.user.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!existingUser) {
        const newUser = await this.prisma.user.create({
          data: {
            userId: userId,
            name: name,
            email: email,
            profilePicture: profilePicture,
          },
        });

        // Automatically create default income categories for new user
        // We catch errors inside the service to not block user creation
        await this.incomeCategoryService.createDefaultIncomeCategories(userId);

        return this.presentationService.toUserModel(newUser);
      }
      return this.presentationService.toUserModel(existingUser);
    } catch (error) {
      throw new DatabaseError("error in creating user in database");
    }
  }

  async getUserByUserId(userId: UserId): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!user) {
        return null;
      }
      return this.presentationService.toUserModel(user);
    } catch (error) {
      throw new DatabaseError("error in getting user from database");
    }
  }

  async updateUser(params: IUpdateUserParams): Promise<UserModel> {
    try {
      const { userId, name, profilePicture } = params;

      const updatedUser = await this.prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          name: name,
          profilePicture: profilePicture,
        },
      });

      return this.presentationService.toUserModel(updatedUser);
    } catch (error) {
      throw new DatabaseError("error in updating the user");
    }
  }

  async deleteAccount(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { userId },
      });

      if (!user) {
        return false;
      }

      /**
       * BONUS: Prisma Schema Improvement
       * ---------------------------------
       * You could configure onDelete: Cascade directly in `schema.prisma` for the relations
       * e.g., user User @relation(fields: [userId], references: [userId], onDelete: Cascade)
       * 
       * Why manual deletion (with a Prisma transaction) is sometimes safer:
       * 1. Application-level logging: You can trigger events, send emails, or log exactly what is removed.
       * 2. Soft-deletes: If you ever change requirements to just set `isDeleted = true`, it's easier to refactor.
       * 3. Prevents accidental mass unrecoverable cascading drops directly at the DB engine layer.
       * 4. Safe partial handling if some data must be retained (like anonymous analytics).
       */
      await this.prisma.$transaction(async (tx) => {
        await tx.expense.deleteMany({ where: { userId } });
        await tx.monthlyLimit.deleteMany({ where: { userId } });
        await tx.loan.deleteMany({ where: { userId } });
        await tx.invest.deleteMany({ where: { userId } });
        
        await tx.user.delete({ where: { userId } });
      });

      console.log(`Successfully deleted account and all associated data for user: ${userId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting account for user ${userId}:`, error);
      throw new DatabaseError("error in deleting the user account");
    }
  }
}

export default UserService;
