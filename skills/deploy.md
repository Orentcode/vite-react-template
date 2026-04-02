# Skill: deploy

## Purpose
Deploy the Vidnavi Home app worker (`vite-react-template`) to Cloudflare Workers with consistent preflight checks for local-to-prod auth routing.

This is the default deploy path for `projects/vidnavi/app-vidnavi`.

## Invocation
```bash
/deploy app-vidnavi [--env production] [--dry-run]
```

Examples:
```bash
/deploy app-vidnavi --dry-run
/deploy app-vidnavi --env production
```

---

## Prerequisites

- Worker project exists at `projects/vidnavi/app-vidnavi/`
- `wrangler.json` contains routes/bindings for current deployment target.
- Build env vars are configured for target environment:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SUPABASE_REDIRECT_URL` (prod)
  - `VITE_PRIMARY_SITE_URL` (prod)
  - `VITE_HOME_APP_URL` (prod)
- Cloudflare auth available via either:
  - `wrangler login`, or
  - exported API token/account (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).

---

## Execution Steps

### Step 1 — Resolve worker path
Path is fixed:
`projects/vidnavi/app-vidnavi/`

### Step 2 — Verify local tree state
```bash
cd projects/vidnavi/app-vidnavi
git status --short
```

### Step 3 — Verify Cloudflare auth
```bash
wrangler whoami
```

### Step 4 — Build check
```bash
cd projects/vidnavi/app-vidnavi
npm run build
```

### Step 5 — Optional dry run
```bash
cd projects/vidnavi/app-vidnavi
wrangler deploy --dry-run [--env <environment>]
```

### Step 6 — Deploy
```bash
cd projects/vidnavi/app-vidnavi
wrangler deploy [--env <environment>]
```

### Step 7 — Smoke checks
- Root route:
  - `GET /` returns app shell (200)
- Home surface entry:
  - `GET /?surface=home&intent=signup` returns auth flow shell (200)
- Login entry:
  - `GET /?surface=home&intent=login` returns auth flow shell (200)
- SPA deep link rewrite:
  - `GET /app` and `GET /app?surface=home&intent=login` resolve to app shell

### Step 8 — Auth callback validation
- From landing popup, click `Continue with Google`.
- Confirm callback returns to the same environment host.
- Confirm `returnTo` deep-link context is restored after auth.

---

## External Console Checks (non-repo)

### Supabase
- `Authentication -> URL Configuration`
  - Redirect allowlist includes:
    - `http://localhost:5173/*`
    - `http://127.0.0.1:5173/*`
    - `http://localhost:5174/*`
    - `http://127.0.0.1:5174/*`
    - `https://<prod-domain>/*`
- `Authentication -> Providers`
  - Google enabled
  - Apple enabled

### Google OAuth
- Authorized redirect URI points to Supabase callback:
  - `https://<supabase-project-ref>.supabase.co/auth/v1/callback`

### Apple OAuth
- Sign in with Apple service config is valid for the Supabase callback flow.

---

## Notes

- This project uses `wrangler.json` (not `wrangler.toml`).
- Frontend `VITE_*` variables are build-time values; changing Worker runtime vars alone will not update already-built frontend redirects.
- If `--env` is used, corresponding Wrangler env blocks must exist in config.
