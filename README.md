# Caltrax

Premium nutrition & health tracking. Next.js 14 (App Router) + TypeScript (strict) + Tailwind + Prisma/PostgreSQL.

## Getting started

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000 — it redirects to `/dashboard`, which renders live against
the goal engine (see below) using a sample profile until auth + real data wiring lands.

## What's built (Phase 1 foundation)

- **Project scaffold**: Next.js + TypeScript (strict mode, no implicit any, no unchecked
  indexed access) + Tailwind, ready to `npm install` and run.
- **Design system** (`tailwind.config.ts`, `globals.css`): near-black dark-mode-first
  palette, glass card primitive (24px blur, 22px radius per spec), semantic accent
  colors (blue/green/orange/red mapped to info/success/warning/danger), macro-specific
  hues, reduced-motion support, visible focus rings.
- **Goal engine** (`src/lib/goalEngine.ts`): real, tested-by-hand math — Mifflin-St
  Jeor BMR, activity-multiplier TDEE, goal-specific protein/fat/carb splits, a hard
  safety floor on minimum calories, and rate-of-change capped at 1% bodyweight/week
  regardless of user input. Pure functions, no UI coupling.
- **Database schema** (`prisma/schema.prisma`): Users, Profiles, Foods (multi-source:
  Open Food Facts / USDA / custom), MealEntries, WeightLogs, WaterLogs, Reminders.
- **Dashboard** (`src/app/dashboard/page.tsx` + `src/components/dashboard/*`):
  Calories-remaining hero ring, macro rings (protein/carbs/fat/fibre), hydration
  widget with quick-add, weight trend chart (Recharts) — all live components, not
  static mockups, wired to `calculateGoals()`.
- **Supplement education data** (`src/lib/supplements.ts`): the 12 supplements listed
  in the spec, each with a general evidence-based range, timing, interactions and a
  source link — paired with a mandatory disclaimer constant that must render
  alongside every card. This is reference information, not personalized dosing.

## Roadmap (not yet built — in priority order)

**Phase 1 — finish the core loop**
1. Auth (email/password + session, OAuth-ready) and onboarding flow that collects
   the `UserProfileInput` fields and calls `calculateGoals()` to create the Profile row.
2. Food search + barcode lookup against Open Food Facts (primary) and USDA FoodData
   Central (secondary), normalized into the `Food` model.
3. Meal logging UI (breakfast/lunch/dinner/snack) writing `MealEntry` rows, with the
   dashboard reading real aggregates instead of the sample data.
4. Weight/water logging UI writing to `WeightLog`/`WaterLog`.

**Phase 2 — camera & AI**
5. Browser camera access (`getUserMedia`) for barcode/QR scanning (a `zxing-wasm`
   dependency is already in `package.json` for this) and nutrition-label OCR.
6. AI meal photo recognition + AI daily/weekly/monthly insights, calling the
   Anthropic API server-side with structured JSON output.

**Phase 3 — depth**
7. Recipes, meal templates, weekly meal planner, favourites/recent foods.
8. Full micronutrient tracking (vitamins A/B/C/D/E/K, minerals, omega-3/6) end to end
   through logging, storage and dashboard charts.
9. Reminders (meal/water/exercise/weight-check/supplement) with push notifications.
10. Achievements/badges, weekly/monthly/yearly reports.

**Phase 4 — platform**
11. PWA packaging (manifest + service worker + offline cache).
12. Wearable/health-platform integrations (Apple Health, Health Connect, Garmin,
    Fitbit, Whoop, Oura, smart scales, CGMs).
13. Premium subscription, social features, family accounts, multi-language.

## Notes on scope

This spec describes a product on the scale of MyFitnessPal/MacroFactor — a realistic
build is months of engineering, not one pass. This foundation is real, working code
(not mockups) for the pieces most projects get wrong if rushed: the math, the schema,
and the visual system. Everything above builds directly on top of it without needing
rework.
