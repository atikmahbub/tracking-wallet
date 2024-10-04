import { UserModel } from "@shared/models/User";
import { IAddUserParams, IUpdateUserParams } from "@shared/params";
import { UserId } from "@shared/primitives";

export interface IUserService {
  addUser: (params: IAddUserParams) => Promise<UserModel>;
  getUser: (userId: UserId) => Promise<UserModel>;
  updateUser: (params: IUpdateUserParams) => Promise<UserModel>;
}
