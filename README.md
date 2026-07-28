# Caltrax

Premium nutrition & health tracking PWA. Next.js 16 (App Router) + React 19 + TypeScript
(strict) + Tailwind + shadcn/ui-style primitives + Supabase (Auth + Postgres) + Prisma.

Repo: https://github.com/adeth0/Caltrax
Production: https://caltrax.kavauralabs.com

> **Note on stack versions**: the original brief specified Next.js 15. We're on Next.js
> 16 instead — Next 15.0.x pins React to an unstable RC, which is what broke the first
> Vercel build; the fix that actually resolves cleanly is Next 16 + stable React 19,
> which also carries December 2025's critical Next.js security patches and doesn't sunset
> until well past Next 15's Oct 2026 end-of-support date. One consequence: PWA support
> uses **Serwist** instead of `next-pwa`, since `next-pwa` only hooks into Webpack and
> Next 16 defaults to Turbopack. Also, `middleware.ts` is renamed `proxy.ts` per Next 16
> convention (logic is unchanged).

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in Supabase + database values
npx prisma migrate dev --name init
npm run dev
```

Visiting `/` redirects to `/dashboard`, which `proxy.ts` gates behind Supabase auth —
you'll land on `/login` until you sign up. Email/password and Google OAuth both work
once Supabase is configured (see below).

## Supabase setup (one-time)

1. Create a project at supabase.com.
2. Project Settings → API: copy the URL and anon key into `.env.local`.
3. Project Settings → Database: copy the pooled (port 6543) and direct (port 5432)
   connection strings into `DATABASE_URL` / `DIRECT_URL`.
4. Authentication → Providers: enable Google if you want the "Continue with Google"
   button to work (Apple is spec'd as future-ready, not wired up yet).
5. Authentication → URL Configuration: add `https://caltrax.kavauralabs.com/auth/callback`
   and `http://localhost:3000/auth/callback` as redirect URLs.
6. Run `npx prisma migrate dev` to create the app tables (`profiles`, `foods`,
   `meal_entries`, `weight_logs`, `water_logs`, `reminders`, `wearable_connections`,
   `activity_logs`) in the same Postgres instance Supabase Auth uses.

## Wearable sync setup (optional — Phase 4)

Fitbit and Withings sync via cloud OAuth APIs, no native app needed. Apple Health
and Android Health Connect are deliberately **not** here — both are on-device-only
frameworks with no cloud REST API, so they need the native app wrapper (a later
phase) instead.

1. **Fitbit**: register a "Personal" app at [dev.fitbit.com/apps/new](https://dev.fitbit.com/apps/new)
   (instant approval, no review wait). OAuth 2.0 Application Type: **Server**.
   Redirect URI: `https://caltrax.kavauralabs.com/api/wearables/FITBIT/callback`
   (add `http://localhost:3000/api/wearables/FITBIT/callback` too for local dev —
   Fitbit allows multiple redirect URIs on one app). Copy the Client ID/Secret into
   `FITBIT_CLIENT_ID`/`FITBIT_CLIENT_SECRET`.
2. **Withings**: register an app at [developer.withings.com](https://developer.withings.com)
   (also self-serve, instant). Callback URL:
   `https://caltrax.kavauralabs.com/api/wearables/WITHINGS/callback` (+ localhost
   equivalent). Copy the Client ID/Secret into `WITHINGS_CLIENT_ID`/`WITHINGS_CLIENT_SECRET`.
3. Add `/api/cron/wearables-sync` to the same external scheduler used for reminders
   (e.g. cron-job.org), with the same `CRON_SECRET` bearer header. Activity/weight
   data doesn't need the 5-15 min granularity reminders do — once every 30-60 min
   is plenty, since Fitbit/Withings themselves only update every few minutes at best.

Users connect their own devices from Settings → Connected devices — nothing else
to configure per-user.

## Testing

```bash
npm run test          # Vitest — unit tests (goal engine math is covered)
npm run test:e2e      # Playwright — e2e smoke tests (starts the dev server itself)
npm run lint          # ESLint (flat config, eslint-config-next 16)
npm run format:check  # Prettier
```

`npm run dev` / `npm run build` explicitly pass `--webpack` — Serwist (the PWA layer)
still generates its service worker via Webpack even though Next 16 defaults to
Turbopack. This has been verified locally: clean install, lint, format, tests, and a
full production build all pass with the exact dependency versions pinned in
`package-lock.json`.

## What's built

**Foundation (this pass)**

- Next.js 15 / React 19 project, strict TypeScript, Tailwind design system matching
  the exact spec palette (`#090909` background, `#141414` surface, Apple system
  accent colors), glass-panel primitive, reduced-motion support, visible focus rings.
- Supabase Auth wired end-to-end: `/login`, `/signup`, OAuth callback route, session
  refresh in `middleware.ts`, route protection for the whole `(app)` route group.
- App shell: desktop sidebar + mobile bottom tab bar (shared nav config), dark/light
  theme switching via `next-themes` (dark by default), Zustand store for shell UI state.
- shadcn-style `Button`/`Input` primitives (Radix + `class-variance-authority` + `cn()`).
- React Hook Form + Zod on both auth forms — the pattern to reuse for the onboarding
  and food-logging forms next.
- PWA: manifest + generated icon set (192/512/512-maskable/apple-touch-icon),
  **Serwist** wired into `next.config.js` (Turbopack-compatible, unlike `next-pwa`),
  installable on iOS/Android/desktop.
- SEO: metadata, Open Graph, `robots.ts`, `sitemap.ts`.
- Loading skeletons and error boundaries (route-level + global).
- Prisma schema refactored so `Profile` (not a separate `User` table) is keyed
  directly off the Supabase `auth.users` id.
- Goal engine (`src/lib/goalEngine.ts`) — Mifflin-St Jeor BMR, TDEE, goal-specific
  macro splits, hard safety floor on minimum calories — now with a real Vitest suite.
- Dashboard — calorie ring, macro rings, hydration, weight trend chart — reading
  from the goal engine (still sample data pending the logging endpoints below).
- Supplement education reference data with mandatory disclaimer.
- ESLint + Prettier (with `prettier-plugin-tailwindcss`) configured and passing.

## Roadmap (next, in priority order)

**Phase 1 — finish the core loop ✅ done**

1. ✅ Onboarding flow: RHF+Zod form collecting `UserProfileInput`, writes the `Profile`
   row via a Server Action on first sign-in.
2. ✅ Food search (Open Food Facts) → `Food` model, cached on first log.
3. ✅ Meal logging UI (`/log`) writing `MealEntry` rows; dashboard reads real daily
   aggregates instead of the sample data.
4. ✅ Weight/water logging UI writing to `WeightLog`/`WaterLog`; `/progress` reads real history.

**Phase 2 — camera & AI ✅ done**

5. ✅ Browser camera (`getUserMedia`) + `zxing-wasm` for barcode scanning (`/log`), with a
   manual-entry and custom-food fallback for anything not in Open Food Facts.
6. ✅ AI meal photo recognition (`/log`, photo → Claude vision → structured item estimates,
   reviewable/editable before logging) + on-demand 7-/30-day insights (`/progress`) via the
   Anthropic API (server-side only, structured JSON output, requires `ANTHROPIC_API_KEY`).
   Not yet done: nutrition-label OCR specifically (barcode scan covers most packaged food
   instead) — revisit if users hit unlabelled/unbarcoded packaging often.

**Phase 3 — depth** 7. ✅ Recipes, favourites/recent foods, weekly meal planner. (Meal templates beyond recipes not
done separately — recipes cover that need.) 8. ✅ Micronutrient tracking — vitamin A/C/D/E/K, calcium, iron,
magnesium, potassium, zinc, sodium tracked against standard adult RDA targets on `/progress`. Sourced from Open Food
Facts where present (coverage varies by product; OFF's raw fields are grams for everything except energy —
converted to mg/mcg on ingest, see `src/lib/foodSearch.ts`). Omega-3/6 not included — OFF's coverage there is too
sparse to be useful. 9. ✅ Reminders (meal/water/exercise/weight-check/supplement) with Web Push notifications.
Vercel Hobby's cron is capped at once/day, so `/api/cron/reminders` is designed to be called by a free external
scheduler (e.g. cron-job.org) every 5-15 min instead of Vercel's own cron — see CRON_SECRET in `.env.example`. 10. ✅ Achievements/badges (streaks, milestones — see src/lib/achievements.ts, checked on
every dashboard load) and weekly/monthly/yearly reports (`/progress` → Reports tab: avg calories/macros/water
vs target, weight change, and a daily calorie chart vs target line). This closes out Phase 3.

**Phase 4 — platform** 11. ✅ Wearable sync — Fitbit (steps + active calories, feeding a real
"earned calories from exercise" adjustment on the dashboard — previously a hardcoded `burned={0}`)
and Withings (smart-scale weigh-ins auto-logged instead of manual entry). Both via cloud OAuth,
no native app required. Garmin/Oura/Whoop/CGMs not yet done — same `WearableProviderAdapter`
shape, each is incremental work once wanted. Apple Health / Android Health Connect are
structurally blocked until the native app wrapper exists (both are on-device-only frameworks,
no cloud API). 12. Premium subscription, social features, family accounts, multi-language.

**Fixed along the way:** `proxy.ts`'s session gate was redirecting _every_ unauthenticated
request to `/login` — including `/api/cron/*` calls from an external scheduler, which
authenticate via `CRON_SECRET` instead of a session and never carry one. This made
`/api/cron/reminders` unreachable in production (redirected before its own auth check ever
ran) — reminders were very likely never firing. Fixed by exempting `/api/cron/*` from the
session gate; those routes already do their own bearer-token check.

## Deploying

Push to `main` on GitHub, connect the repo in Vercel, add the env vars from
`.env.example` (Vercel dashboard → Settings → Environment Variables), and add
`caltrax.kavauralabs.com` under Settings → Domains with a CNAME record pointing
`caltrax` → `cname.vercel-dns.com`. Every push to `main` auto-deploys.
