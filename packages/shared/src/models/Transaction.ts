import { UnixTimeStampString } from "@shared/primitives";

export type TransactionType = "expense" | "income";

export class TransactionModel {
  constructor(
    public id: string,
    public type: TransactionType,
    public amount: number,
    public description: string | null,
    public date: UnixTimeStampString,
    public category: {
      name: string | null;
      icon: string | null;
      color: string | null;
    } | null
  ) {}
}
