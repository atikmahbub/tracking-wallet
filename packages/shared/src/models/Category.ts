import { CategoryId, UnixTimeStampString, UserId } from "@shared/primitives";

export class NewCategoryModel {
  constructor(
    public name: string,
    public icon: string,
    public color: string
  ) {}
}

export class CategoryModel extends NewCategoryModel {
  constructor(
    public id: CategoryId,
    name: string,
    icon: string,
    color: string,
    public created: UnixTimeStampString,
    public updated: UnixTimeStampString,
    /** Owner; null for the built-in default categories. */
    public userId: UserId | null = null
  ) {
    super(name, icon, color);
  }
}
