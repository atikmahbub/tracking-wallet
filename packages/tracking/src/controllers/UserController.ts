import { UserId } from "@shared/primitives";
import { MissingFieldError } from "@tracking/errors";
import UserService from "@tracking/services/UserService";
import { AuthenticationUtils } from "@tracking/utils/AuthenticationUtils";
import { Request, Response, NextFunction } from "express";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async addUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId, name, email, profilePicture } = req.body;

      if (!name || !email || !profilePicture) {
        throw new MissingFieldError(
          "Name, Email, Profile Picture are required field"
        );
      }
      const newUser = await this.userService.addUser({
        userId: userId,
        name: name,
        email: email,
        profilePicture: profilePicture,
      });

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async getUserByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);

      const { userId } = req.params;

      const user = await this.userService.getUserByUserId(UserId(userId));
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      AuthenticationUtils.assureUserHasUserId(req);
      const { userId } = req.params;
      const { name, profilePicture } = req.body;

      const updatedUser = await this.userService.updateUser({
        userId: UserId(userId),
        name: name,
        profilePicture: profilePicture,
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
