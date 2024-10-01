import { URLString, UserId } from "@shared/primitives";

export interface IAddUserParams {
  userId: UserId;
  name: string;
  email: string;
  profilePicture: URLString;
}
