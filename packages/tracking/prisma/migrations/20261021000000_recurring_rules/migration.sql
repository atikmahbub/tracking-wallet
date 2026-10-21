-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "occurrenceDate" TIMESTAMP(3),
ADD COLUMN     "recurringRuleId" BYTEA;

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "occurrenceDate" TIMESTAMP(3),
ADD COLUMN     "recurringRuleId" BYTEA;

-- CreateTable
CREATE TABLE "recurring_rules" (
    "id" BYTEA NOT NULL,
    "userId" TEXT NOT NULL,
    "type" VARCHAR(16) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(128),
    "categoryId" BYTEA,
    "frequency" VARCHAR(16) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "lastRunDate" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recurring_rule_user_id_index" ON "recurring_rules"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "expense_recurring_occurrence_unique" ON "Expense"("recurringRuleId", "occurrenceDate");

-- CreateIndex
CREATE UNIQUE INDEX "income_recurring_occurrence_unique" ON "Income"("recurringRuleId", "occurrenceDate");
