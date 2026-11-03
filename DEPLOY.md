# Deploy FDE Hero Academy

The app is a static Next.js export. `npm run build` writes the complete website to `out/`, including the installable web app shell and offline lesson routes.

## Vercel

1. Push this project to a Git provider and import the repository in Vercel.
2. Use the Next.js framework preset, Node.js 20, and `npm ci` as the install command.
3. Use `npm run build` as the build command. Set the output directory to `out` if Vercel does not detect the static export automatically.
4. Deploy the preview, open the main routes, then promote it to production in Vercel.

## Cloudflare Pages

1. Connect the repository to Cloudflare Pages.
2. Set the build command to `npm ci && npm run build` and the build output directory to `out`.
3. Deploy the preview and check the home page, a lesson, a field lab, and the interview guide before promoting it.

## GitHub Pages or another static host

Run `npm ci && npm run build`, then publish the contents of `out/`. Configure the host to serve `index.html` for the root and respect the generated trailing-slash routes. If hosting under a repository subpath, set Next.js `basePath` and `assetPrefix` before building.

## Local production preview

Run `npm run build` followed by `npm run start` and open `http://localhost:3000`. The start script serves the static export in `out/`; `next start` is not used for this static site.

Progress lives in each learner's browser storage. It is not synced between devices; learners can export and import a JSON backup from Profile.
