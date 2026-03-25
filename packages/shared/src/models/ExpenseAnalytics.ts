import { CategoryId } from "@shared/primitives";

export class ExpenseCategoryBreakdownModel {
  constructor(
    public categoryId: CategoryId | null,
    public categoryName: string | null,
    public totalAmount: number,
    public percentage: number
  ) {}
}

export class ExpenseTopCategoryModel {
  constructor(
    public categoryId: CategoryId | null,
    public categoryName: string | null,
    public totalAmount: number
  ) {}
}

export class ExpenseAnalyticsModel {
  constructor(
    public totalExpense: number,
    public categoryBreakdown: ExpenseCategoryBreakdownModel[],
    public topCategory: ExpenseTopCategoryModel | null
  ) {}
}
