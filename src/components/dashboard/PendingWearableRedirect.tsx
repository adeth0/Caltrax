"use client";

import { useEffect } from "react";

const KNOWN_PROVIDERS = new Set(["FITBIT", "WITHINGS", "OURA", "WHOOP"]);

/**
 * Onboarding's "connect a device" step can't safely link straight to the
 * OAuth flow -- that would navigate away before the onboarding form is
 * ever submitted, losing every answer from the steps before it. Instead
 * it saves the intent to sessionStorage and finishes onboarding normally;
 * this component (mounted on the dashboard, the guaranteed post-onboarding
 * landing page) picks that up once and continues the OAuth round trip.
 */
export function PendingWearableRedirect() {
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingWearableConnect");
    if (!pending || !KNOWN_PROVIDERS.has(pending)) return;
    sessionStorage.removeItem("pendingWearableConnect");
    window.location.href = `/api/wearables/${pending}/connect`;
  }, []);

  return null;
}
