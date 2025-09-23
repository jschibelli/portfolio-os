import { PrismaClient } from "@prisma/client";

// Use the Prisma client from the root package
// This ensures we're using the same database connection
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
