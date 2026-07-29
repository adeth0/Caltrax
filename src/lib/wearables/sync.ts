import type { WearableConnection } from "@prisma/client";
import { db } from "@/lib/db";
import { getProviderAdapter } from "./index";

/** Refresh a minute before actual expiry, to avoid a request landing right on the boundary. */
const REFRESH_SKEW_MS = 60_000;

async function ensureFreshToken(connection: WearableConnection): Promise<WearableConnection> {
  if (connection.expiresAt.getTime() - REFRESH_SKEW_MS > Date.now()) {
    return connection;
  }
  const adapter = getProviderAdapter(connection.provider);
  const tokens = await adapter.refresh(connection.refreshToken);
  return db.wearableConnection.update({
    where: { id: connection.id },
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      scope: tokens.scope,
    },
  });
}

/**
 * Syncs one connection: refreshes its token if needed, pulls recent data,
 * and upserts it. Never throws — a failed sync is recorded on the
 * connection (lastSyncError) so the Settings UI can surface "reconnect
 * needed" instead of the cron silently failing forever.
 */
export async function syncWearableConnection(connectionIn: WearableConnection): Promise<void> {
  let connection = connectionIn;
  try {
    connection = await ensureFreshToken(connection);
    const adapter = getProviderAdapter(connection.provider);
    const result = await adapter.fetchRecent(connection.accessToken);

    if (result.activity) {
      for (const day of result.activity) {
        await db.activityLog.upsert({
          where: {
            userId_date_source: {
              userId: connection.userId,
              date: new Date(`${day.date}T00:00:00.000Z`),
              source: connection.provider,
            },
          },
          create: {
            userId: connection.userId,
            date: new Date(`${day.date}T00:00:00.000Z`),
            source: connection.provider,
            steps: day.steps,
            activeCalories: day.activeCalories,
            restingHeartRate: day.restingHeartRate,
          },
          update: {
            steps: day.steps,
            activeCalories: day.activeCalories,
            restingHeartRate: day.restingHeartRate,
          },
        });
      }
    }

    if (result.weights) {
      for (const reading of result.weights) {
        // Weigh-ins aren't unique-constrained the way activity days are (a
        // user might genuinely weigh in twice in one day on a manual scale),
        // so auto-synced entries are matched by (user, source, date) in app
        // code rather than a DB constraint, to update rather than duplicate
        // on every re-poll.
        const dayStart = new Date(`${reading.date}T00:00:00.000Z`);
        const dayEnd = new Date(`${reading.date}T23:59:59.999Z`);
        const existing = await db.weightLog.findFirst({
          where: {
            userId: connection.userId,
            source: connection.provider,
            loggedAt: { gte: dayStart, lte: dayEnd },
          },
        });
        if (existing) {
          await db.weightLog.update({
            where: { id: existing.id },
            data: { weightKg: reading.weightKg, bodyFatPct: reading.bodyFatPct },
          });
        } else {
          await db.weightLog.create({
            data: {
              userId: connection.userId,
              weightKg: reading.weightKg,
              bodyFatPct: reading.bodyFatPct,
              source: connection.provider,
              loggedAt: dayStart,
            },
          });
        }
      }
    }

    await db.wearableConnection.update({
      where: { id: connection.id },
      data: { lastSyncedAt: new Date(), lastSyncError: null },
    });
  } catch (err) {
    await db.wearableConnection.update({
      where: { id: connection.id },
      data: { lastSyncError: err instanceof Error ? err.message : "Unknown sync error" },
    });
  }
}

export async function syncAllConnections(): Promise<{ synced: number; failed: number }> {
  const connections = await db.wearableConnection.findMany();
  let failed = 0;
  for (const connection of connections) {
    await syncWearableConnection(connection);
    const refreshed = await db.wearableConnection.findUnique({ where: { id: connection.id } });
    if (refreshed?.lastSyncError) failed++;
  }
  return { synced: connections.length - failed, failed };
}
