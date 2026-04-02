# Review Instructions

- Treat `wrangler.json` and any future Cloudflare Workers bindings as high-risk config changes.
- Flag any Cloudflare Workers API or limit usage that does not appear grounded in current Cloudflare documentation.
- If bindings change in `wrangler.json`, verify whether `worker-configuration.d.ts` should be regenerated with `npx wrangler types`.
- Prefer findings about behavior regressions, deployment/config risks, security, and missing tests over style-only feedback.
- Keep frontend changes aligned with the existing app unless the change explicitly asks for a new visual direction.
