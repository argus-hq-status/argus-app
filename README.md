# Argus App

TanStack Start (Vite + Nitro) frontend for Argus uptime monitoring.

## Prerequisites

- Node.js 22+
- Yarn 1 (classic) — enabled via Corepack: `corepack enable yarn`
- [Engine](https://github.com/argus-hq-status/argus-engine) running on `localhost:4000`

## Setup

```bash
cp .env.example .env
yarn install
```

## Dev

```bash
yarn dev
```

Starts on `http://localhost:3000`. The Vite dev server proxies `/api/*` to the engine
(`http://localhost:4000`). No manual CORS setup needed in development.

## Build

```bash
yarn build
```

Output goes to `.output/`. Run with `node .output/server/index.mjs`.

## Lint & Typecheck

```bash
yarn lint
yarn typecheck
```

## Deployment

Estimated **$0/mo** using free tiers:

| Resource | Service | Cost |
|---|---|---|
| SSR app | [Railway](https://railway.app) (always-on) | Free (500 hr/mo) |
| — or — | [Fly.io](https://fly.io) (shared-cpu-1x) | Free (3 VMs) |
| — or — | [Cloudflare Pages](https://pages.cloudflare.com) (SSR via Nitro adapter) | Free |

Deploy via Docker (Dockerfile included) or push to Railway / Fly.io from Git.

### Railway (easiest)

1. `railway login`
2. `railway init`
3. Set env vars via dashboard
4. `railway up` — auto-detects the Dockerfile

### Fly.io

```bash
fly launch
fly secrets set API_URL=https://engine.fly.dev
fly deploy
```

### Cloudflare Pages (SSR)

Set `nitro.preset: "cloudflare-pages"` in `vite.config.ts`, then:

```bash
yarn build
npx wrangler pages deploy .output/public
```
