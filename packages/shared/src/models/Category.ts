import { ECategoryType } from "@shared/enums";
import { CategoryId, UnixTimeStampString, UserId } from "@shared/primitives";

export class NewCategoryModel {
  constructor(
    public name: string,
    public icon: string,
    public color: string,
    public type: ECategoryType,
    public userId: UserId | null
  ) {}
}

export class CategoryModel extends NewCategoryModel {
  constructor(
    public id: CategoryId,
    name: string,
    icon: string,
    color: string,
    type: ECategoryType,
    userId: UserId | null,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString
  ) {
    super(name, icon, color, type, userId);
  }
}
