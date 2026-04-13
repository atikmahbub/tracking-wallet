import { IncomeCategoryId } from "@shared/primitives";

export class IncomeCategoryBreakdownModel {
  constructor(
    public categoryId: IncomeCategoryId | null,
    public categoryName: string | null,
    public totalAmount: number,
    public percentage: number
  ) {}
}

export class IncomeTopCategoryModel {
  constructor(
    public categoryId: IncomeCategoryId | null,
    public categoryName: string | null,
    public totalAmount: number
  ) {}
}

export class IncomeAnalyticsModel {
  constructor(
    public totalIncome: number,
    public categoryBreakdown: IncomeCategoryBreakdownModel[],
    public topCategory: IncomeTopCategoryModel | null
  ) {}
}
