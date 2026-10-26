-- CreateTable
CREATE TABLE "tombstones" (
    "entity" VARCHAR(32) NOT NULL,
    "id" BYTEA NOT NULL,
    "userId" TEXT,
    "deleted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tombstones_pkey" PRIMARY KEY ("entity","id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "key" VARCHAR(320) NOT NULL,
    "status" INTEGER,
    "body" JSONB,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "tombstone_user_id_deleted_index" ON "tombstones"("userId", "deleted");
CREATE INDEX "idempotency_key_created_index" ON "idempotency_keys"("created");
CREATE INDEX "expense_user_id_updated_index" ON "Expense"("userId", "updated");
CREATE INDEX "income_user_id_updated_index" ON "Income"("userId", "updated");
CREATE INDEX "category_user_id_updated_index" ON "Category"("userId", "updated");
CREATE INDEX "income_category_user_id_updated_index" ON "IncomeCategory"("userId", "updated");
CREATE INDEX "monthly_limit_user_id_updated_index" ON "MonthlyLimit"("userId", "updated");
CREATE INDEX "loan_user_id_updated_index" ON "Loan"("userId", "updated");
CREATE INDEX "loan_payment_user_id_updated_index" ON "loan_payments"("userId", "updated");
CREATE INDEX "recurring_rule_user_id_updated_index" ON "recurring_rules"("userId", "updated");
CREATE INDEX "invest_user_id_updated_index" ON "Invest"("userId", "updated");
