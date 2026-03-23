# FleetAI — Arabic-first SaaS for Car Rental Fleet Monitoring

## What is FleetAI?
FleetAI is an Arabic-first SaaS platform for car rental fleet monitoring.
- **Market**: Saudi Arabia first, then GCC
- **Users**: Fleet managers at car rental companies (5–200 vehicles)
- **Core value**: Real-time vehicle health monitoring using OBD devices
- **Arabic (RTL) is the DEFAULT language. English is secondary.**

## Tech Stack (LOCKED — do not suggest alternatives)
- **Frontend**: Next.js 14 (App Router) + TypeScript (strict) + Tailwind CSS
- **UI**: Shadcn/ui + Cairo font (Arabic) + Inter font (English)
- **i18n**: next-intl — Arabic default, RTL from day one
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth (email + Google)
- **Charts**: Recharts
- **Payments**: Moyasar (NOT Stripe)
- **Notifications**: WhatsApp Business API + Twilio SMS

## Health Score Algorithm (DO NOT MODIFY)
- Active DTC codes: 30 points
- Engine temperature: 25 points
- Days since maintenance: 20 points
- Battery voltage: 15 points
- Fuel level: 10 points
- **Total: 0–100 integer, never null**
- Colors: Green >70 | Yellow 40–70 | Red <40

## Engineering Rules (NON-NEGOTIABLE)
1. Every DB table has `company_id` (UUID NOT NULL) — Multi-tenancy
2. Supabase RLS enabled on ALL tables
3. No hardcoded text — everything in `messages/ar.json` + `en.json`
4. Every component works RTL + LTR without breaking
5. TypeScript strict mode — no `any` types
6. Health Score always 0–100 integer, never null

## User Roles
`owner` → `manager` → `technician` → `viewer`

## MVP Scope ONLY (do NOT add anything outside this)
- ✅ Auth (Login/Register + Google)
- ✅ Dashboard (Fleet overview + Health Scores)
- ✅ Vehicle Details (OBD data + DTC codes + maintenance)
- ✅ Alerts System + WhatsApp notifications
- ✅ Add/Edit vehicles + OBD device linking
- ✅ Bilingual AR/EN full support
- ✅ Reports (PDF weekly summary)
- ✅ Settings (company + team management)

## Folder Structure
```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/login/ & register/
│   │   ├── (dashboard)/dashboard/ & vehicles/ & alerts/ & reports/ & settings/
│   │   └── layout.tsx          ← locale layout with RTL + fonts
│   ├── layout.tsx              ← root layout (pass-through)
│   └── page.tsx                ← redirects to /ar
├── components/
│   ├── layout/                 ← Sidebar, Navbar, LanguageSwitcher
│   ├── fleet/                  ← VehicleCard, HealthGauge, FleetStats
│   └── ui/                     ← shadcn components
├── i18n/
│   ├── config.ts               ← locales + defaultLocale
│   └── request.ts              ← next-intl getRequestConfig
├── lib/
│   ├── supabase.ts             ← Supabase client
│   ├── health-score.ts         ← Health Score algorithm
│   └── utils.ts                ← cn() utility
├── types/
│   ├── vehicle.ts
│   ├── alert.ts
│   └── obd.ts
└── middleware.ts               ← next-intl routing
messages/
├── ar.json                     ← Arabic translations (primary)
└── en.json                     ← English translations
```

## GitHub Repository
https://github.com/majxd/fleet-ai-platform.git

## الوضع الحالي
المشروع أنهى Part 3 بالكامل (100%) وتم Deploy على Vercel.
الرابط الحي: https://fleet-ai-platform.vercel.app

## ما تم إنجازه
### Part 3 — ربط البيانات الحقيقية (مكتمل 100%)
- P3-01: Dashboard + Vehicles → Supabase ✅
- P3-02: إضافة / تعديل / حذف المركبات ✅
- P3-03: Alerts + Reports → Supabase ✅
- P3-04: تنبيهات تلقائية + Cleanup ✅
- P3-05: Supabase Realtime ✅
- Auto-Alerts SQL Trigger: تم تشغيله في Supabase ✅
- Alert status update: تم إصلاحه (Server Action بدل browser client) ✅
- Deploy على Vercel ✅

## الإعدادات المهمة
- Vercel Project: fleet-ai-platform
- Live URL: https://fleet-ai-platform.vercel.app
- Supabase Realtime مفعّل على: vehicles, alerts
- Supabase Auth Site URL: https://fleet-ai-platform.vercel.app
- Redirect URLs: https://fleet-ai-platform.vercel.app/** و http://localhost:3000/**

## ملاحظات تقنية مهمة
- لا تستخدم Supabase browser client للـ mutations — استخدم Server Actions (بسبب auth lock bug)
- Supabase browser client يجب أن يكون singleton (lib/supabase-browser.ts)
- Realtime subscriptions لا تستخدم filter مع company_id — RLS يتكفل بالأمان

## المرحلة القادمة
Phase 2 — Pilot مع 3-5 شركات حقيقية:
- جمع ملاحظات المستخدمين
- إصلاح أي bugs تظهر
- تحسين الأداء والتصميم

## Current Progress
- ✅ Session 1: Project scaffold, folder structure, Git setup
- ✅ Session 2: Dashboard Layout + Fleet Dashboard + Auth system
- ✅ Session 3: Locale routing fix (middleware + routing.ts), Cairo/Inter fonts, hydration fix
- ✅ Session 4: Vehicles list page + Vehicle detail page (/vehicles/[id]) with 5 sections (header, OBD, chart, DTC, maintenance)
- ✅ Session 5: Alerts system (database migration, TypeScript types, alerts page with severity/status filters, locale-aware titles, synced badge count in Sidebar and Navbar, RTL sidebar fix)
- ✅ Session 6: Reports page (stats overview, report cards, recent reports table, PDF generation with jsPDF)
- ✅ Session 7: Settings page (company profile, notification preferences, subscription display, team management with roles)
- ✅ Session 8: Supabase backend integration (Part 1/3)
  - Database schema: 9 tables with company_id multi-tenancy
  - RLS policies on all tables with role-based access
  - Supabase client (browser + server + middleware)
  - TypeScript database types with full type safety
  - Seed data for demo company
- ✅ Session 9: Real Supabase Auth (Part 2/3)
  - Registration: creates auth user + company + user profile
  - Login: email/password + Google OAuth button
  - Logout: clears session and redirects
  - useAuth hook for user/company data
  - Protected dashboard routes
  - Real user data in Navbar, Sidebar, Settings
- ✅ Session 10: Replace mock data with real Supabase queries (Part 3/3)
  - Backend fetching layer (`lib/queries`) for Dashboard, Vehicles, and vehicle details
  - Full Vehicle CRUD (Create, Read, Update, Delete) with strictly typed Supabase browser client
  - Integrated bilingual Add/Edit/Delete dialogs with `react-hook-form` and `zod`
  - Fixed localization keys and bypassed overzealous Supabase TS type generic inferences
- ✅ Session 11: Vehicle Detail Page Fixes & Next.js 15 Async Params
  - Fixed routing behavior in AddVehicleDialog to appropriately redirect to localized URLs.
  - Mitigated Supabase auth dropping HTTP cookies within Next.js parallel query renders on the Arabic locale by extracting the `user` evaluation higher within the async scope.
  - Safely unwrapped `Promise` values for Next.js 15 dynamic routing parameters (`params.id`, `params.locale`).
  - Next steps: Live implementation of the Reports (PDF exports) and Settings data integration using Supabase.
- ✅ Session 12: Connect Alerts and Reports to Supabase Data
  - Implemented `lib/queries/alerts.ts` and `lib/queries/reports.ts` for real-time dashboard data.
  - Re-architected Alerts and Reports to use Server Components for data fetching and Client Components (`AlertsClient`, `ReportsClient`) for interactivity.
  - Synced Notification badges in Sidebar and Navbar with actual database counts.
  - Fixed TypeScript interface errors, resolved Supabase query issues (like selecting non-existent columns), and ensured 0 build errors.
  - Next steps: Implement Settings page data integration and fix jsPDF Arabic fonts.
- ✅ Session 13: UI Refinements & Translation Fixes
  - Fixed button stylings across Add/Edit/Delete vehicle dialogs to appropriately match the primary Navy Blue design system (#2471A3).
  - Added missing Arabic and English status translations for the Reports page.
- ✅ Session 14: Cleanup, Automation, and RTL Input Fixes
  - Fixed alert status updates (in-progress/resolved) by passing the company ID from the user session.
  - Implemented an automated Supabase PG trigger (`004_auto_alerts_trigger.sql`) to spawn fleet alerts when health scores drop.
  - Fully deleted old mock data from `src/data/` and updated `generateWeeklyReport` to use live props.
  - Conducted a codebase-wide audit of translations, resolving missing `reports` keys (`vehiclePlate`, `noData`).
  - Adjusted form fields codebase-wide (CRUD Dialogs, Search Inputs, Auth, Settings) to properly respect RTL/LTR input direction based on the user's locale.
  - Next steps: Real Settings data bindings and fixing PDF generation Arabic font encoding.
- ✅ Session 15: DTC Recommendations
  - DTC Repair Recommendations: 47 codes with step-by-step Arabic diagnosis, estimated costs, urgency levels, and copy-to-clipboard feature
## Known Issues
- PDF Arabic text: jsPDF doesn't support Arabic glyphs natively. Needs embedded Arabic font (e.g. Amiri or Cairo) via addFileToVFS(). Will fix in polish phase.
