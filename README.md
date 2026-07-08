# Caltrax

Premium nutrition & health tracking PWA. Next.js 15 (App Router) + React 19 + TypeScript
(strict) + Tailwind + shadcn/ui-style primitives + Supabase (Auth + Postgres) + Prisma.

Repo: https://github.com/adeth0/Caltrax
Production: https://caltrax.kavauralabs.com

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in Supabase + database values
npx prisma migrate dev --name init
npm run dev
```

Visiting `/` redirects to `/dashboard`, which `middleware.ts` gates behind Supabase auth —
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
   `meal_entries`, `weight_logs`, `water_logs`, `reminders`) in the same Postgres
   instance Supabase Auth uses.

## Testing

```bash
npm run test          # Vitest — unit tests (goal engine math is covered)
npm run test:e2e      # Playwright — e2e smoke tests (starts the dev server itself)
npm run lint          # ESLint
npm run format:check  # Prettier
```

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
  `next-pwa` wired into `next.config.js`, installable on iOS/Android/desktop.
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

**Phase 1 — finish the core loop**
1. Onboarding flow: RHF+Zod form collecting `UserProfileInput`, writes the `Profile`
   row via a Server Action on first sign-in.
2. Food search + barcode lookup (Open Food Facts primary, USDA secondary) → `Food` model.
3. Meal logging UI (`/log`) writing `MealEntry` rows; dashboard reads real daily
   aggregates instead of the sample data.
4. Weight/water logging UI writing to `WeightLog`/`WaterLog`; `/progress` reads real history.

**Phase 2 — camera & AI**
5. Browser camera (`getUserMedia`) + `zxing-wasm` for barcode/QR scanning; nutrition
   label OCR.
6. AI meal photo recognition + daily/weekly/monthly insights via the Anthropic API
   (server-side only, structured JSON output).

**Phase 3 — depth**
7. Recipes, meal templates, weekly meal planner, favourites/recent foods.
8. Full micronutrient tracking (vitamins, minerals, omega-3/6) end to end.
9. Reminders (meal/water/exercise/weight-check/supplement) with push notifications.
10. Achievements/badges, weekly/monthly/yearly reports.

**Phase 4 — platform**
11. Wearable/health-platform integrations (Apple Health, Health Connect, Garmin,
    Fitbit, Whoop, Oura, smart scales, CGMs).
12. Premium subscription, social features, family accounts, multi-language.

## Deploying

Push to `main` on GitHub, connect the repo in Vercel, add the env vars from
`.env.example` (Vercel dashboard → Settings → Environment Variables), and add
`caltrax.kavauralabs.com` under Settings → Domains with a CNAME record pointing
`caltrax` → `cname.vercel-dns.com`. Every push to `main` auto-deploys.
