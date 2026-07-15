"use client";

import { useEffect, useState, useTransition } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  sendTestPushAction,
  subscribeToPushAction,
  unsubscribeFromPushAction,
  updateTimezoneAction,
} from "@/app/(app)/settings/actions";

/** Web Push wants the VAPID public key as a raw Uint8Array, not the base64url string it's shipped as. */
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64Safe);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type SupportState = "checking" | "unsupported" | "denied" | "subscribed" | "available";

export function PushSubscribeCard() {
  const [state, setState] = useState<SupportState>("checking");
  const [error, setError] = useState<string | null>(null);
  const [testSent, setTestSent] = useState(false);
  const [isWorking, startWorking] = useTransition();

  useEffect(() => {
    async function check() {
      if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        setState("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setState("denied");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        setState(existing ? "subscribed" : "available");
      } catch {
        setState("unsupported");
      }
    }
    void check();

    // Save the browser's timezone once per session so reminder times fire
    // correctly for this user, without needing a manual settings field.
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) void updateTimezoneAction(tz);
    } catch {
      // Intl.DateTimeFormat is universal in supported browsers; ignore if it somehow throws.
    }
  }, []);

  function handleEnable() {
    setError(null);
    startWorking(async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setState("denied");
          return;
        }

        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicKey) {
          setError("Push isn't configured on this deployment yet.");
          return;
        }

        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
        });

        const json = subscription.toJSON();
        if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
          throw new Error("Subscription missing required fields");
        }

        await subscribeToPushAction({
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
        });

        setState("subscribed");
      } catch {
        setError("Couldn't enable notifications — try again.");
      }
    });
  }

  function handleDisable() {
    startWorking(async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();
        if (subscription) {
          await unsubscribeFromPushAction(subscription.endpoint);
          await subscription.unsubscribe();
        }
        setState("available");
        setTestSent(false);
      } catch {
        setError("Couldn't disable notifications — try again.");
      }
    });
  }

  function handleTest() {
    setError(null);
    startWorking(async () => {
      try {
        await sendTestPushAction();
        setTestSent(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't send a test notification.");
      }
    });
  }

  return (
    <GlassCard>
      <p className="text-sm font-medium text-text-primary">Push notifications</p>

      {state === "checking" && <p className="mt-2 text-xs text-text-tertiary">Checking support…</p>}

      {state === "unsupported" && (
        <p className="mt-2 text-xs text-text-tertiary">
          Push notifications aren&apos;t supported in this browser. On iPhone, add Caltrax to your Home Screen
          first (Share → Add to Home Screen), then enable them from there.
        </p>
      )}

      {state === "denied" && (
        <p className="mt-2 text-xs text-text-tertiary">
          Notifications are blocked for this site. Enable them in your browser&apos;s site settings, then
          reload this page.
        </p>
      )}

      {state === "available" && (
        <>
          <p className="mt-2 text-xs text-text-tertiary">
            Get reminders for meals, water, and weigh-ins right on this device.
          </p>
          <Button type="button" onClick={handleEnable} disabled={isWorking} className="mt-3 w-full">
            {isWorking ? "Enabling…" : "Enable notifications"}
          </Button>
        </>
      )}

      {state === "subscribed" && (
        <>
          <p className="mt-2 text-xs text-accent-info">Notifications are enabled on this device.</p>
          {testSent && <p className="mt-1 text-xs text-text-tertiary">Test notification sent — check now.</p>}
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="glass"
              onClick={handleTest}
              disabled={isWorking}
              className="flex-1"
            >
              Send test
            </Button>
            <Button
              type="button"
              variant="glass"
              onClick={handleDisable}
              disabled={isWorking}
              className="flex-1"
            >
              Disable
            </Button>
          </div>
        </>
      )}

      {error && <p className="mt-2 text-xs text-accent-danger">{error}</p>}
    </GlassCard>
  );
}
