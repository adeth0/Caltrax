"use client";

import { useState, useTransition } from "react";
import type { WearableProvider } from "@prisma/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { disconnectWearableAction, manualSyncWearableAction } from "@/app/(app)/settings/actions";

export interface WearableConnectionRow {
  provider: WearableProvider;
  label: string;
  description: string;
  connected: boolean;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
}

export interface WearableNotice {
  type: "connected" | "error";
  provider?: string;
  error?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  denied: "you declined the connection request.",
  state_mismatch: "the connection request expired — try again.",
  missing_code: "the connection request was incomplete — try again.",
  connect_failed: "something went wrong on our end — try again in a moment.",
  unknown_provider: "that device isn't supported.",
};

interface WearableConnectionsCardProps {
  connections: WearableConnectionRow[];
  notice?: WearableNotice;
}

export function WearableConnectionsCard({ connections, notice }: WearableConnectionsCardProps) {
  const [isWorking, startWorking] = useTransition();
  const [busyProvider, setBusyProvider] = useState<WearableProvider | null>(null);

  function handleDisconnect(provider: WearableProvider) {
    setBusyProvider(provider);
    startWorking(async () => {
      await disconnectWearableAction(provider);
      setBusyProvider(null);
    });
  }

  function handleSync(provider: WearableProvider) {
    setBusyProvider(provider);
    startWorking(async () => {
      await manualSyncWearableAction(provider);
      setBusyProvider(null);
    });
  }

  return (
    <GlassCard>
      <p className="mb-1 text-sm font-medium text-text-primary">Connected devices</p>
      <p className="mb-3 text-xs text-text-tertiary">
        Sync steps and active calories from a fitness tracker, or auto-log weigh-ins from a smart scale.
      </p>

      {notice?.type === "connected" && (
        <p className="mb-3 text-xs text-accent-info">{notice.provider} connected and synced.</p>
      )}
      {notice?.type === "error" && (
        <p className="mb-3 text-xs text-accent-danger">
          Couldn&apos;t connect {notice.provider ?? "that device"} —{" "}
          {ERROR_MESSAGES[notice.error ?? ""] ?? "try again."}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {connections.map((c) => {
          const busy = isWorking && busyProvider === c.provider;
          return (
            <div key={c.provider} className="rounded-control bg-white/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{c.label}</p>
                  <p className="text-xs text-text-tertiary">{c.description}</p>
                </div>
                {!c.connected && (
                  <Button asChild variant="glass" size="sm" className="shrink-0">
                    <a href={`/api/wearables/${c.provider}/connect`}>Connect</a>
                  </Button>
                )}
              </div>

              {c.connected && (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-text-tertiary">
                    {c.lastSyncError
                      ? "Sync failed — reconnect below"
                      : c.lastSyncedAt
                        ? `Last synced ${c.lastSyncedAt}`
                        : "Connected, not synced yet"}
                  </p>
                  <div className="flex shrink-0 gap-3">
                    {c.lastSyncError ? (
                      <a
                        href={`/api/wearables/${c.provider}/connect`}
                        className="touch-target focus-ring control px-2 text-xs text-accent-info hover:underline"
                      >
                        Reconnect
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleSync(c.provider)}
                        className="touch-target focus-ring control px-2 text-xs text-accent-info hover:underline"
                      >
                        {busy ? "Syncing…" : "Sync now"}
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDisconnect(c.provider)}
                      className="touch-target focus-ring control px-2 text-xs text-text-tertiary hover:text-accent-danger"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
