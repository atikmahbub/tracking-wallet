import { IncomeCategoryId, UnixTimeStampString, UserId } from "@shared/primitives";

export class NewIncomeCategoryModel {
  constructor(
    public name: string,
    public icon: string,
    public color: string,
    public userId: UserId | null = null
  ) {}
}

export class IncomeCategoryModel extends NewIncomeCategoryModel {
  constructor(
    public id: IncomeCategoryId,
    name: string,
    icon: string,
    color: string,
    userId: UserId | null,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString
  ) {
    super(name, icon, color, userId);
  }
}
