-- Per-loan choice to count the loan and its repayments as income/expense.
ALTER TABLE "Loan" ADD COLUMN     "countInBalance" BOOLEAN NOT NULL DEFAULT false;
