import { PrismaClient } from "@prisma/client";

// Standard Next.js pattern: cache the client on `globalThis` in dev so
// hot-reloading doesn't spin up a new connection pool on every save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
