import { UnixTimeStampString, URLString, UserId } from "@shared/primitives";

export class NewUser {
  constructor(
    public name: string,
    public email: string,
    public userId: UserId,
    public profilePicture: URLString
  ) {}
}

export class UserModel extends NewUser {
  constructor(
    userId: UserId,
    name: string,
    email: string,
    profilePicture: URLString,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString
  ) {
    super(name, email, userId, profilePicture);
  }
}
