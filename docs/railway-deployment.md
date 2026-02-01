# Deploying to Railway

This app is set up for deployment on [Railway](https://railway.app). The repo includes:

- **`railway.json`** – Build and start commands (Railpack runs `npm run build`, then `npm run start`).
- **`serve`** – Production server that serves the Vite `dist` output with SPA fallback (client-side routing).

## One-time setup

1. **Create a Railway project** and connect this repo (GitHub/GitLab).
2. **Set environment variables** in the Railway service (Variables tab). These are **baked in at build time** by Vite, so they must be set before the build runs:

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `VITE_SUPABASE_URL` | Yes | Supabase project URL (e.g. `https://<project>.supabase.co`) |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key |
   | `VITE_SUPABASE_PROJECT_ID` | Optional | Supabase project reference ID |

   Do **not** commit `.env` or real keys to the repo; use Railway’s Variables (or Reference) for secrets.

3. **Deploy** – Push to the linked branch; Railway will build and run using `railway.json`.  
   Or use the [Railway CLI](https://docs.railway.app/develop/cli): `railway up`.

## Build and run (what Railway does)

- **Build:** `npm run build` → outputs to `dist/`.
- **Start:** `npm run start` → runs `serve dist -s -l $PORT` (SPA mode; Railway sets `PORT`).

## Local production check

```bash
npm run build
npm run start
```

Then open `http://localhost:3000` (or the port shown). `PORT` is read from the environment; default is 3000.

## Custom domain and HTTPS

In the Railway dashboard, open your service → **Settings** → **Networking** → add a custom domain. Railway provides TLS automatically.
