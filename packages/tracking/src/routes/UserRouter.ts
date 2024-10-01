import UserController from "@tracking/controllers/UserController";
import { Router } from "express";

class UserRoutes {
  private userController: UserController;

  constructor(userController: UserController) {
    this.userController = userController;
  }

  public registerUserRouter(): Router {
    const router = Router();

    router.post(
      "/user/add",
      this.userController.addUser.bind(this.userController)
    );
    router.get(
      "/user/:userId",
      this.userController.getUserByUserId.bind(this.userController)
    );

    return router;
  }
}

export default UserRoutes;
