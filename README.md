# Setu

Real internships, close to home. A mobile-first prototype of the Setu local internship marketplace: students, small businesses and the Setu admin team, all in one clickable app.

Two ways to run it:

- **With Supabase** (production): the demo is saved in a shared Postgres database. Two people on two devices see the same data. See "Set up Supabase and Vercel" below.
- **Without Supabase** (default when no keys are set): everything runs on `localStorage` in one browser.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Production check:

```bash
npm run build
npm run preview    # http://localhost:4173
```

Requires Node 20 or newer.

## Try the demo

Open the app and pick a role from the landing page, from `/continue`, or from the small "Demo" chip in the app header.

- **Student (Priya):** Home, open "Accounts Intern", tap "Apply with my profile", see the "What happens next" timeline, then check "My applications".
- **Business (Sharma Traders, Ramesh):** Home, "Look at applicants", Accept or "Not this time". Then switch back to Student to see the status change. "Post another opening" runs the five-step guided flow.
- **Admin (Setu team):** Dashboard, "Verify" Kalyan Accounting Services (tick the visit box), then switch to Student. Its Billing Assistant opening now shows with "Visited by Setu".

In the Demo chip you can also pick which business you continue as. Choose Kalyan Accounting Services or Sahyadri Foods to see the "waiting for a Setu visit" state. "Reset demo data" puts everything back.

Two browser tabs stay in sync (through `localStorage` locally, through the database with Supabase), so you can keep Student and Business side by side.

## Set up Supabase and Vercel

### 1. Database (Supabase)

The database is described entirely by the files in `supabase/migrations`. Run in order:

| File | What it does |
| --- | --- |
| `20260924000001_schema.sql` | Five tables: students, smes, internships, applications, notifications |
| `20260924000002_security_and_realtime.sql` | Row Level Security, minimal grants for the public `anon` role, live updates |
| `20260924000003_seed_and_reset.sql` | Demo data (Pune, BCOM Arts & Commerce College) and the `reset_demo_data()` function behind the "Reset demo data" button |

With the Supabase GitHub integration connected, pushing to the branch it watches applies new migrations to your project. In the Supabase dashboard, open **Project Settings > Integrations > GitHub** and check:

- **Production branch:** `main`
- **Supabase directory:** `.` (the folder that contains `supabase/`)
- **Deploy to production:** on

Then push:

```bash
git add .
git commit -m "Add Supabase schema and Vercel config"
git push origin main
```

Check **Database > Migrations** in the dashboard. All three should show as applied. Do not edit a migration after it has been applied. Add a new file with a later timestamp instead.

Prefer the command line? `npx supabase link --project-ref <ref>` then `npx supabase db push` applies the same files.

### 2. Keys

In Supabase, open **Project Settings > API** and copy the Project URL and the `anon` (or "publishable") key. For local work:

```bash
cp .env.example .env.local   # then paste the two values
npm run dev
```

Use only the public key. Never put the `service_role` or secret key in this app.

### 3. Hosting (Vercel)

1. Import the GitHub repository in Vercel. It detects Vite. `vercel.json` already sets the build command, output folder and the rewrite that makes deep links like `/student/openings/int_accounts` work on refresh.
2. Add two environment variables (Production and Preview): `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   Using Vercel's Supabase integration instead? It adds `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The app reads those names too.
3. Deploy. Each push to `main` redeploys.

Vite bakes these values in at build time, so redeploy after changing them.

If the site shows "The database is not set up yet", the migrations have not run on the project that the keys point to.

### How the app uses the database

- The app reads all five tables when it opens, and again when the tab regains focus, every 20 seconds, and when Supabase sends a live change.
- Each action (apply, accept, verify and so on) updates the screen at once, then saves only the rows that changed. If a save fails, the screen goes back to what the database holds and shows a message.
- Which role you are, which business you continue as, and your saved openings stay in this browser only.
- The Supabase library loads only when keys are set, so local mode stays light.

### Before real users (important)

This is a demo. There is no sign-in. The browser uses the public `anon` key, and the rules in `20260924000002_security_and_realtime.sql` let anyone with the site read and change the demo rows. That includes student phone numbers, which the screens hide until an application is accepted but the database does not. This is fine for fake demo data. It is not safe for real students or businesses.

Before real data goes in:

1. Add Supabase Auth (phone OTP fits this audience).
2. Add `auth_user_id` columns and replace each `using (true)` policy with rules such as "a student sees their own applications" and "a business sees applicants for its own openings".
3. Put student phone numbers behind a rule or a view that only shows them after `accepted`.
4. Remove the public `reset_demo_data()` function, or restrict it to admins.
5. Move `apply`, `accept` and `verify` into database functions so the rules cannot be skipped from the browser.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Landing page |
| `/continue` | Demo role picker |
| `/student` | Home (openings, filters) |
| `/student/openings/:id` | Opening details, Apply |
| `/student/applied/:id` | Application sent, What happens next |
| `/student/applications` | My applications |
| `/student/applications/:id` | Application status |
| `/student/profile`, `/student/onboarding`, `/student/notifications` | Profile, first-time setup, notifications |
| `/sme` | Business home |
| `/sme/openings`, `/sme/openings/:id/applicants` | Openings, applicants |
| `/sme/post` | Post an opening (one question per screen) |
| `/sme/help`, `/sme/profile`, `/sme/onboarding`, `/sme/notifications` | Help, profile, setup, notifications |
| `/admin` | Dashboard and verification queue |
| `/admin/smes`, `/admin/openings`, `/admin/students`, `/admin/applications` | Admin lists |

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router (lazy routes), Lucide icons, Poppins (self-hosted through Fontsource). Supabase (Postgres) for data, Vercel for hosting.

## Structure

```
src/
  components/  brand, ui, navigation, internship, student, sme, admin
  pages/       Landing, student, sme, admin
  data/        mockStudents, mockSMEs, mockInternships, mockApplications
  hooks/       useApp (state, saving, refreshing), useSpeech (optional voice typing)
  lib/         supabase (client), db (rows <-> app types, change detection), format, selectors, options, config
  styles/      index.css  <- all design tokens live here
  types/
supabase/
  config.toml
  migrations/  schema, security, seed + reset
vercel.json    hosting settings
.env.example   the two variables to set
```

If you change the demo data, change both `src/data/mock*.ts` (local mode) and the seed migration (Supabase). For an already-applied migration, add a new migration instead of editing it.

## Design system

The single source of truth is the `@theme` block in `src/styles/index.css`, taken from the style guide in `product_specifications.docx` (Step 7). Deep Teal `#0F6B6B`, Apricot `#F4A261`, Ink `#26263A`, Cream `#FBF8F3`, the five Mist tints, Poppins, radius 16/14/12, soft shadows. Colours are not hardcoded anywhere else. The logo files in `src/assets` are cut from the supplied logo sheet and are never recoloured or stretched.

## Intentional MVP limits

- No AI matching, chatbot, payments, contracts, credit API, multiple towns or messaging.
- SMS is simulated. Status changes show in the app and on the notifications page.
- The Setu support number in `src/lib/config.ts` is a placeholder. Call and Chat (WhatsApp) use it.
- The regional language toggle from the PRD is not built yet (open question in the PRD: which language).
- The testimonials on the landing page are marked as illustrative, because they come from the launch plan and not from real customers.
- Voice typing in "Post an opening" uses the browser's speech recognition where available.
