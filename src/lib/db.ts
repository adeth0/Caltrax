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

/**
 * Retries a query once on Postgres error 42P05 ("prepared statement
 * already exists") -- a well-documented interaction between Prisma's
 * prepared-statement caching and Supabase's Transaction-mode connection
 * pooler (PgBouncer) when DATABASE_URL is missing the required
 * `?pgbouncer=true` parameter (see .env.example / README), and one that
 * can surface intermittently even with it under enough concurrency.
 *
 * The real fix is that connection string parameter -- this is deliberate
 * defense in depth so a single query hitting this transient, retryable
 * error doesn't take down an entire page render. Use on the first
 * database call in any Server Component that isn't already wrapped in
 * its own error handling (Server Actions already degrade gracefully via
 * their own try/catch patterns elsewhere in this codebase).
 */
export async function withPreparedStatementRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const isPreparedStatementCollision =
      err instanceof Error &&
      err.message.includes("prepared statement") &&
      err.message.includes("already exists");
    if (!isPreparedStatementCollision) throw err;
    console.warn("Retrying query after a prepared-statement collision (see db.ts for context)");
    return fn();
  }
}
