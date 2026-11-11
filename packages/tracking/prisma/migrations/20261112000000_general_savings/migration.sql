-- AlterTable
ALTER TABLE "savings_goals" ALTER COLUMN "target" DROP NOT NULL;
ALTER TABLE "savings_goals" ADD COLUMN     "kind" VARCHAR(16) NOT NULL DEFAULT 'goal';

-- Only one general savings pot per user (Prisma can't express a partial index).
CREATE UNIQUE INDEX "savings_goal_one_general_per_user" ON "savings_goals"("userId") WHERE "kind" = 'general';
