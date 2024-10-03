import { PrismaClient } from "@prisma/client";
import { IAddUserParams, IUpdateUserParams } from "@shared/params";
import { UserId } from "@shared/primitives";
import { DatabaseError } from "@tracking/errors";
import { UserModel } from "@tracking/models/User";
import { PresentationService } from "@tracking/utils/presentationService";

class UserService {
  private prisma: PrismaClient;
  private presentationService: PresentationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.presentationService = new PresentationService();
  }

  async addUser(params: IAddUserParams): Promise<UserModel> {
    try {
      const { userId, name, email, profilePicture } = params;

      const newUser = await this.prisma.user.create({
        data: {
          userId: userId,
          name: name,
          email: email,
          profilePicture: profilePicture,
        },
      });

      return this.presentationService.toUserModel(newUser);
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
}

export default UserService;
