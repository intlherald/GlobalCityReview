# GlobalCityReview.com

Independent Next.js App Router site for GlobalCityReview.com.

## Development

```bash
bun install
bun run dev
```

## Required Environment

```txt
CMS_API_BASE=https://replace-with-admin-public-api.example.com
SITE_SLUG=global-city-review
DEFAULT_LANGUAGE=en
SITE_URL=https://www.globalcityreview.com
CONTACT_EMAIL=letters@globalcityreview.com
ADDRESS=30 Cecil Street, Prudential Tower, Singapore 049712
```

The site SSRs against the admin Public API and intentionally ships no mock content.

## Cloudflare Workers deployment

This project is adapted for Cloudflare Workers through OpenNext for Cloudflare.

Commands:

```bash
bun install
bun run cf:build
bun run cf:preview
bun run cf:deploy
```

Before deploying, update `CMS_API_BASE` in `wrangler.jsonc` to the public admin API origin. The committed value is a placeholder and must not be used in production.

Runtime variables are defined in `wrangler.jsonc` under `vars`. Secrets should be configured with `wrangler secret put <NAME>` instead of being committed.
