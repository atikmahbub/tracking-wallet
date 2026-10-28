-- "repayment" pays a loan down; "topup" adds to it (borrowed or lent more).
ALTER TABLE "loan_payments" ADD COLUMN     "kind" VARCHAR(16) NOT NULL DEFAULT 'repayment';
