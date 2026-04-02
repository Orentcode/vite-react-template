# React + Vite + Hono + Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

This template provides a minimal setup for building a React application with TypeScript and Vite, designed to run on Cloudflare Workers. It features hot module replacement, ESLint integration, and the flexibility of Workers deployments.

![React + TypeScript + Vite + Cloudflare Workers](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

<!-- dash-content-start -->

🚀 Supercharge your web development with this powerful stack:

- [**React**](https://react.dev/) - A modern UI library for building interactive interfaces
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server
- [**Hono**](https://hono.dev/) - Ultralight, modern backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform for global deployment

### ✨ Key Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ ESLint configuration included
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🔄 Full-stack development setup
- 🔎 Built-in Observability to monitor your Worker

Get started in minutes with local development or deploy directly via the Cloudflare dashboard. Perfect for building modern, performant web applications at the edge.

<!-- dash-content-end -->

## Getting Started

To start a new project with this template, run:

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/vite-react-template
```

A live deployment of this template is available at:
[https://react-vite-template.templates.workers.dev](https://react-vite-template.templates.workers.dev)

## Development

Install dependencies:

```bash
npm install
```

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Auth Redirect Setup (Local + Production)

### In Code (already handled)

- Entry links use relative URLs (`/?surface=home&intent=signup|login`).
- OAuth `redirectTo` includes:
  - `surface=home`
  - `intent=signup|login`
  - `returnTo=<relative-path>` for deep-link restoration after auth.
- Local host detection supports `localhost`, `127.0.0.1`, `::1`, and `.local`.
- Worker `/app` rewrites preserve query strings.

### Local `.env.local`

Set:

```bash
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Optional:

- Leave `VITE_SUPABASE_REDIRECT_URL` unset for local development.
- If you set it, use a local origin callback URL.

### Supabase Dashboard (required)

In `Authentication -> URL Configuration`:

- Add Redirect URLs:
  - `http://localhost:5173/*`
  - `http://127.0.0.1:5173/*`
  - `http://localhost:5174/*`
  - `http://127.0.0.1:5174/*`
  - `https://<your-prod-domain>/*`

In `Authentication -> Providers`:

- Enable Google and Apple providers with valid credentials.

### Production env

Set:

```bash
VITE_SUPABASE_REDIRECT_URL=https://<your-prod-domain>/?surface=home
VITE_PRIMARY_SITE_URL=https://<your-prod-domain>
VITE_HOME_APP_URL=https://<your-prod-domain>
```

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run build && npm run deploy
```

Monitor your workers:

```bash
npx wrangler tail
```

## AI Review

This repo is set up to use CodeRabbit for local reviews before commits and for automatic pull request reviews on GitHub.

Install the CLI and run a local review:

```bash
curl -fsSL https://cli.coderabbit.ai/install.sh | sh
cr auth login
npm run review:local
```

For agent-friendly output that you can hand back to me or another coding agent:

```bash
npm run review:local:agent
```

If you want review to run automatically before commits, enable the included hook:

```bash
npm run enable:review-hook
```

Notes:

- The hook runs `cr --type uncommitted`, so it reviews the current working tree instead of only staged hunks.
- Use `SKIP_AI_REVIEW=1 git commit ...` if you need to bypass the hook once.
- Install the CodeRabbit GitHub App for this repository to enable automatic PR reviews.
- Shared review defaults live in `.coderabbit.yaml`.

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
