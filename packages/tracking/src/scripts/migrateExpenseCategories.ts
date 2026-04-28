import { PrismaClient } from "@prisma/client";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";

const prisma = new PrismaClient();

async function migrateExpenseCategories() {
  console.log("Starting Expense Category Migration...");
  try {
    const users = await prisma.user.findMany({
      select: { userId: true },
    });
    console.log(`Found ${users.length} users.`);

    const globalCategories = await prisma.category.findMany({
      where: { userId: null },
    });
    console.log(`Found ${globalCategories.length} global expense categories.`);

    for (const user of users) {
      console.log(`Migrating for user ${user.userId}...`);

      const existingUserCategories = await prisma.category.findMany({
        where: { userId: user.userId },
        select: { name: true },
      });
      const existingNames = new Set(existingUserCategories.map((c) => c.name));

      const categoriesToCreate = globalCategories
        .filter((c) => !existingNames.has(c.name))
        .map((c) => ({
          id: uuidBuffer.toBuffer(v4()),
          name: c.name,
          icon: c.icon,
          color: c.color,
          userId: user.userId,
        }));

      if (categoriesToCreate.length > 0) {
        await prisma.category.createMany({
          data: categoriesToCreate,
          skipDuplicates: true,
        });
        console.log(
          `Created ${categoriesToCreate.length} categories for user ${user.userId}`
        );
      } else {
        console.log(`No new categories needed for user ${user.userId}`);
      }
    }
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateExpenseCategories();
