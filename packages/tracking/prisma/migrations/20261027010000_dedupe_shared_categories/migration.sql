-- Shared default categories (no owner) were created repeatedly: the unique
-- index on (name, userId) treats NULLs as distinct, and the income create
-- endpoint stored categories without a userId as shared ones. Keep the
-- oldest shared row per name, repoint everything that used a duplicate,
-- record the duplicates as deleted (so synced devices drop them) and remove
-- them.

-- Income categories
CREATE TEMP TABLE income_category_dupes AS
SELECT c."id" AS "dupId", k."id" AS "keepId"
FROM "IncomeCategory" c
JOIN (
  SELECT DISTINCT ON ("name") "name", "id"
  FROM "IncomeCategory"
  WHERE "userId" IS NULL
  ORDER BY "name", "created", "id"
) k ON k."name" = c."name"
WHERE c."userId" IS NULL AND c."id" <> k."id";

UPDATE "Income" i
SET "categoryId" = d."keepId", "updated" = CURRENT_TIMESTAMP
FROM income_category_dupes d
WHERE i."categoryId" = d."dupId";

UPDATE "recurring_rules" r
SET "categoryId" = d."keepId", "updated" = CURRENT_TIMESTAMP
FROM income_category_dupes d
WHERE r."type" = 'income' AND r."categoryId" = d."dupId";

INSERT INTO "tombstones" ("entity", "id", "userId", "deleted")
SELECT 'incomeCategory', d."dupId", NULL, CURRENT_TIMESTAMP
FROM income_category_dupes d
ON CONFLICT ("entity", "id") DO NOTHING;

DELETE FROM "IncomeCategory" c
USING income_category_dupes d
WHERE c."id" = d."dupId";

-- Expense categories
CREATE TEMP TABLE expense_category_dupes AS
SELECT c."id" AS "dupId", k."id" AS "keepId"
FROM "Category" c
JOIN (
  SELECT DISTINCT ON ("name") "name", "id"
  FROM "Category"
  WHERE "userId" IS NULL
  ORDER BY "name", "created", "id"
) k ON k."name" = c."name"
WHERE c."userId" IS NULL AND c."id" <> k."id";

UPDATE "Expense" e
SET "categoryId" = d."keepId", "updated" = CURRENT_TIMESTAMP
FROM expense_category_dupes d
WHERE e."categoryId" = d."dupId";

UPDATE "recurring_rules" r
SET "categoryId" = d."keepId", "updated" = CURRENT_TIMESTAMP
FROM expense_category_dupes d
WHERE r."type" = 'expense' AND r."categoryId" = d."dupId";

INSERT INTO "tombstones" ("entity", "id", "userId", "deleted")
SELECT 'category', d."dupId", NULL, CURRENT_TIMESTAMP
FROM expense_category_dupes d
ON CONFLICT ("entity", "id") DO NOTHING;

DELETE FROM "Category" c
USING expense_category_dupes d
WHERE c."id" = d."dupId";

DROP TABLE income_category_dupes;
DROP TABLE expense_category_dupes;
