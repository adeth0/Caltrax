import webpush from "web-push";
import { db } from "@/lib/db";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "https://caltrax.kavauralabs.com";

  if (!publicKey || !privateKey) {
    throw new Error("Push notifications aren't configured — VAPID keys are missing from the environment.");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Sends a push notification to every subscription this user has (they may
 * have several — one per browser/device). Subscriptions that are no longer
 * valid (the browser unsubscribed, cleared data, etc — surfaced as 404/410
 * from the push service) are deleted so we stop wasting sends on them.
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  ensureConfigured();

  const subscriptions = await db.pushSubscription.findMany({ where: { userId } });
  if (subscriptions.length === 0) return;

  const body = JSON.stringify(payload);

  await Promise.all(
    subscriptions.map(async (sub: (typeof subscriptions)[number]) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await db.pushSubscription.delete({ where: { id: sub.id } }).catch(() => undefined);
        }
        // Other errors (network blips, etc) are swallowed per-subscription so
        // one bad endpoint doesn't stop the rest of this user's devices, or
        // the rest of the cron run, from getting their reminder.
      }
    })
  );
}
