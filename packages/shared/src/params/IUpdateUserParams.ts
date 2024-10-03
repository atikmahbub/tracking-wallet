import { URLString, UserId } from "@shared/primitives";

export interface IUpdateUserParams {
  userId: UserId;
  name?: string;
  profilePicture?: URLString;
}
