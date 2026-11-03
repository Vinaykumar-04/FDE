# Turn on accounts and cloud progress

The academy is a static website, so account creation and data storage run through Supabase Auth and its Postgres Data API. Guest progress continues to save in the browser. When a learner signs in for the first time, local and cloud progress merge; after that, changes sync to the account.

## 1. Create the Supabase project

Create a project at [Supabase](https://supabase.com/dashboard). In **Project Settings → API**, copy the project URL and the **publishable key**. The publishable key is intended for browser use; never use a `service_role` or secret key in this app.

## 2. Create the progress table

In the Supabase **SQL Editor**, run [`supabase/migrations/20261103000000_create_fde_progress.sql`](supabase/migrations/20261103000000_create_fde_progress.sql). It creates one progress row per auth user and enables row-level security so each account can only access its own row.

## 3. Configure email sign-in

In **Authentication → Providers**, enable Email. In **Authentication → URL Configuration**, set the local Site URL to `http://localhost:3000` and allow `http://localhost:3000/account/` as a redirect URL. Add the same paths for your production domain before deploying. Configure the email templates and SMTP settings you want learners to receive.

## 4. Add the public project settings

Copy `.env.example` to `.env.local` and fill in the URL and publishable key. These `NEXT_PUBLIC_` values are included in the built website, so do not put secrets in them. After setting these values, rebuild the static export:

```powershell
npm run build
npm run start
```

For hosting, add the same two variables to the hosting project's build environment and deploy a fresh build. The database stays on Supabase; only the static `out/` folder is hosted with the website.

## 5. Try it

Open `/account/`, create an account, confirm the verification email if enabled, then sign in. Existing guest progress merges into that account. Open the same deployed site on another browser and sign in with the same email to restore it there.

## What is stored

The app stores lesson completions, quiz and lab best scores, boss clears, XP, streak details, and review-card schedules in a JSON progress record. It does not store passwords itself; Supabase Auth handles credentials. The SQL policy binds every progress row to the authenticated user's ID.

## Local-only behavior

If the Supabase environment variables are missing, account creation is disabled with setup instructions, while guest learning and browser-local progress continue to work. Cloud sync needs a Supabase project, the SQL migration, and the variables at build time.
