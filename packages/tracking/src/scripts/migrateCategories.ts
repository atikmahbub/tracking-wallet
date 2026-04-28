import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });
import { PrismaClient } from "@prisma/client";
import * as uuidBuffer from "uuid-buffer";
import { v4 } from "uuid";

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log("Starting category migration...");
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users.`);

    const globalCategories = await prisma.category.findMany({
      where: { userId: null },
    });
    console.log(`Found ${globalCategories.length} global categories.`);

    let createdCount = 0;

    for (const user of users) {
      const userCategories = await prisma.category.findMany({
        where: { userId: user.userId },
      });
      
      const userCategoryMap = new Map(userCategories.map(c => [c.name, c.id]));

      for (const globalCat of globalCategories) {
        let userCatId = userCategoryMap.get(globalCat.name);

        if (!userCatId) {
          const newCat = await prisma.category.create({
            data: {
              id: uuidBuffer.toBuffer(v4()),
              name: globalCat.name,
              icon: globalCat.icon,
              color: globalCat.color,
              userId: user.userId,
            },
          });
          userCatId = newCat.id;
          createdCount++;
        }

        // Re-link expenses that were using this global category to the new user-specific one
        const updateResult = await prisma.expense.updateMany({
          where: {
            userId: user.userId,
            categoryId: globalCat.id,
          },
          data: {
            categoryId: userCatId,
          },
        });
        
        if (updateResult.count > 0) {
          console.log(`Updated ${updateResult.count} expenses for user ${user.userId} to use category "${globalCat.name}"`);
        }
      }
    }

    console.log(`Migration complete. Created ${createdCount} user-specific categories.`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
