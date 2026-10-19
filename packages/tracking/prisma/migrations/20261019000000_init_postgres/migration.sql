-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('GIVEN', 'TAKEN');

-- CreateEnum
CREATE TYPE "EInvestStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "full_name" VARCHAR(256) NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" BYTEA NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(128),
    "date" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" BYTEA,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" BYTEA NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "icon" VARCHAR(128) NOT NULL,
    "color" VARCHAR(32) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" BYTEA NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(128),
    "date" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" BYTEA,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeCategory" (
    "id" BYTEA NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "icon" VARCHAR(128) NOT NULL,
    "color" VARCHAR(32) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "IncomeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyLimit" (
    "id" BYTEA NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" BYTEA NOT NULL,
    "loanType" "LoanType" NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "deadLine" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "note" VARCHAR(512),

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invest" (
    "id" BYTEA NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "note" VARCHAR(512) NOT NULL,
    "status" "EInvestStatus" NOT NULL DEFAULT 'ACTIVE',
    "amount" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "earned" DOUBLE PRECISION,

    CONSTRAINT "Invest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "user_email_index" ON "User"("email");

-- CreateIndex
CREATE INDEX "expense_user_id_date_index" ON "Expense"("userId", "date");

-- CreateIndex
CREATE INDEX "expense_category_id_index" ON "Expense"("categoryId");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");

-- CreateIndex
CREATE INDEX "income_user_id_date_index" ON "Income"("userId", "date");

-- CreateIndex
CREATE INDEX "income_category_id_index" ON "Income"("categoryId");

-- CreateIndex
CREATE INDEX "income_category_user_id_index" ON "IncomeCategory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "IncomeCategory_name_userId_key" ON "IncomeCategory"("name", "userId");

-- CreateIndex
CREATE INDEX "monthly_limit_user_id_index" ON "MonthlyLimit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyLimit_userId_month_year_key" ON "MonthlyLimit"("userId", "month", "year");

-- CreateIndex
CREATE INDEX "loan_user_id_index" ON "Loan"("userId");

-- CreateIndex
CREATE INDEX "invest_status_userId_index" ON "Invest"("status", "userId");

-- CreateIndex
CREATE INDEX "invest_user_id_index" ON "Invest"("userId");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "IncomeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeCategory" ADD CONSTRAINT "IncomeCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyLimit" ADD CONSTRAINT "MonthlyLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invest" ADD CONSTRAINT "Invest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

