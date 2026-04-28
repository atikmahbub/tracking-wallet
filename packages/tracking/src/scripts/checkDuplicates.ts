import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDuplicates() {
  try {
    const categories = await prisma.category.findMany();
    console.log(`Total categories: ${categories.length}`);

    const duplicates: any[] = [];
    const seen = new Set<string>();

    for (const cat of categories) {
      const key = `${cat.name}_${cat.userId}`;
      if (seen.has(key)) {
        duplicates.push(cat);
      } else {
        seen.add(key);
      }
    }

    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate categories!`);
      duplicates.forEach(d => {
        console.log(`Duplicate: Name="${d.name}", UserId="${d.userId}", ID="${d.id.toString('hex')}"`);
      });
    } else {
      console.log("No duplicates found for [name, userId] pairs.");
    }

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicates();
