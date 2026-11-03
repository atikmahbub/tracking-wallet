import { PrismaClient } from "@prisma/client";

/**
 * The one PrismaClient for the API process. Each client opens its own
 * connection pool, so creating several multiplies connections to the database.
 */
const prisma = new PrismaClient();

export default prisma;
