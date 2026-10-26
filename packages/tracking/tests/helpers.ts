import { PrismaClient } from "@prisma/client";

// Bypass Auth0 JWT verification; ownership is checked against body userId.
jest.mock("@tracking/middlewares/authenticateToken", () => ({
  authenticateToken: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

export const prisma = new PrismaClient();

export const USER_A = "auth0|user-a";
export const USER_B = "auth0|user-b";

export async function resetDb(): Promise<void> {
  await prisma.tombstone.deleteMany();
  await prisma.idempotencyKey.deleteMany();
  await prisma.recurringRule.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.income.deleteMany();
  await prisma.loanPayment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.category.deleteMany();
  await prisma.incomeCategory.deleteMany();
  await prisma.user.deleteMany();
  for (const userId of [USER_A, USER_B]) {
    await prisma.user.create({
      data: {
        userId,
        email: `${userId}@example.com`,
        name: userId,
        profilePicture: "",
      },
    });
  }
}
