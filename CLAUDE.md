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

## Current Progress
- ✅ Session 1: Project scaffold, folder structure, Git setup
- ✅ Session 2: Dashboard Layout + Fleet Dashboard + Auth system
- ✅ Session 3: Locale routing fix (middleware + routing.ts), Cairo/Inter fonts, hydration fix
- ✅ Session 4: Vehicles list page + Vehicle detail page (/vehicles/[id]) with 5 sections (header, OBD, chart, DTC, maintenance)
- ✅ Session 5: Alerts system (database migration, TypeScript types, alerts page with severity/status filters, locale-aware titles, synced badge count in Sidebar and Navbar, RTL sidebar fix)
- ✅ Session 6: Reports page (stats overview, report cards, recent reports table, PDF generation with jsPDF — known issue: Arabic text encoding in PDF needs custom font)
- Next: Settings (company + team management)

## Known Issues
- PDF Arabic text: jsPDF doesn't support Arabic glyphs natively. Needs embedded Arabic font (e.g. Amiri or Cairo) via addFileToVFS(). Will fix in polish phase.
