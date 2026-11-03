# FDE Hero Academy

A mobile-first learning app for people starting toward Forward Deployed Engineer (FDE) work. It includes six levels (36 lessons), interactive field labs, a quiz gate and boss challenge for every level, review cards, interview preparation, and local progress tracking.

## Run locally

1. Install Node.js 20 or newer.
2. In this folder, run `npm ci` (or `npm install` if you are developing the project).
3. Run `npm run dev` and open the local address shown in the terminal.

To create the static site, run `npm run build`. Lesson modules are generated from `content/lesson-drafts.json`; the exported site is written to `out/` and can be hosted on any static web host.

## Add a lesson

Add a draft to `content/lesson-drafts.json` with its level, lesson id, title, and teaching notes. Run `npm run generate:lessons`, then add its id to `lessonIdsByLevel` in `src/lib/content.ts` and its static import to `src/lib/lesson-modules.ts`. The app validates lesson metadata with Zod during static generation.

## Add a game

Write the rules and scoring in `content/games.md`, then add a game to `src/lib/games.ts` and its title mapping to `src/lib/content.ts`. Games should have a clear win condition, keyboard-operable choices, and a short explanation after each answer. Static routes are generated from the game data; update the service-worker precache list in `public/sw.js`.

## Progress and current scope

Progress is stored in the browser and can be exported from the profile page as JSON. Levels unlock in sequence after passing each level’s quiz and boss challenge. Company listings in the interview guide link to official career pages and have a checked date in `content/sources.json`.

Guest progress remains local. Optional account creation and cross-device progress sync use Supabase; see [ACCOUNT_SETUP.md](ACCOUNT_SETUP.md) to configure the project URL, publishable key, and secured progress table.

## Deployment

See [DEPLOY.md](DEPLOY.md) for static hosting instructions. The app is exported to `out/`; it has no server-side database or required secrets.

## Checks

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

Playwright needs its Chromium browser installed once with `npx playwright install chromium`.
