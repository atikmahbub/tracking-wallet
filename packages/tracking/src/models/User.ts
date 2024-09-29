import { UnixTimeStampString, URLString, UserId } from "@shared/primitives";

export class NewUser {
  constructor(
    public name: string,
    public email: string,
    public userId: UserId,
    public profile_picture: URLString
  ) {}
}

export class UserModel extends NewUser {
  constructor(
    userId: UserId,
    name: string,
    email: string,
    profile_picture: URLString,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString
  ) {
    super(name, email, userId, profile_picture);
  }
}
