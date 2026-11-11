-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "savingsGoalId" BYTEA;

-- CreateTable
CREATE TABLE "savings_goals" (
    "id" BYTEA NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "icon" VARCHAR(32) NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "targetDate" TIMESTAMP(3),
    "refill" BOOLEAN NOT NULL DEFAULT false,
    "reachedAt" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savings_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_entries" (
    "id" BYTEA NOT NULL,
    "goalId" BYTEA NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" VARCHAR(512),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savings_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "savings_goal_user_id_index" ON "savings_goals"("userId");

-- CreateIndex
CREATE INDEX "savings_goal_user_id_updated_index" ON "savings_goals"("userId", "updated");

-- CreateIndex
CREATE INDEX "savings_entry_goal_id_index" ON "savings_entries"("goalId");

-- CreateIndex
CREATE INDEX "savings_entry_user_id_index" ON "savings_entries"("userId");

-- CreateIndex
CREATE INDEX "savings_entry_user_id_updated_index" ON "savings_entries"("userId", "updated");

-- AddForeignKey
ALTER TABLE "savings_goals" ADD CONSTRAINT "savings_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_entries" ADD CONSTRAINT "savings_entries_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "savings_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
