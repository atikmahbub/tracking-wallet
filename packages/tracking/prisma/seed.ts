import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import * as uuidBuffer from "uuid-buffer";
import { IncomeCategoryService } from "../src/services/IncomeCategoryService";

const prisma = new PrismaClient();
const incomeCategoryService = new IncomeCategoryService(prisma);

const defaultCategories = [
  { name: "Food", icon: "utensils", color: "#FF6B6B" },
  { name: "Groceries", icon: "shopping-cart", color: "#4ECDC4" },
  { name: "Transport", icon: "car", color: "#1DD3B0" },
  { name: "Bills", icon: "file-invoice", color: "#FFA500" },
  { name: "Shopping", icon: "shopping-bag", color: "#9B5DE5" },
  { name: "Entertainment", icon: "gamepad", color: "#FFB347" },
  { name: "Health", icon: "heartbeat", color: "#E63946" },
  { name: "Travel", icon: "plane", color: "#00B4D8" },
  { name: "Subscriptions", icon: "repeat", color: "#6D597A" },
  { name: "Housing", icon: "home", color: "#2A9D8F" },
  { name: "Education", icon: "book", color: "#264653" },
  { name: "Personal", icon: "user", color: "#F4A261" },
  { name: "Kids", icon: "baby", color: "#FF99C8" },
  { name: "Other", icon: "dots-horizontal", color: "#ADB5BD" },
];

async function seedCategories(): Promise<void> {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        icon: category.icon,
        color: category.color,
      },
      create: {
        id: uuidBuffer.toBuffer(uuidv4()),
        name: category.name,
        icon: category.icon,
        color: category.color,
      },
    });
  }
}

async function main(): Promise<void> {
  try {
    // Phase 1: Seed global expense categories
    await seedCategories();
    console.log(`Seeded ${defaultCategories.length} global categories.`);

    // Phase 2: Seed default income categories for all existing users
    await incomeCategoryService.seedIncomeCategoriesForAllUsers();
  } catch (error) {
    console.error("Failed to seed database", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
