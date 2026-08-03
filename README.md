# Strauz

TanStack Start (Vite + Nitro) frontend for Strauz uptime monitoring.

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

**$0/mo** — deployed on [Vercel](https://vercel.com) (Hobby tier).

The Nitro preset is already set to `vercel` in `vite.config.ts`. Build produces a
`.vercel/output/` directory that Vercel recognises automatically.

### Via Git (recommended)

1. Push your repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your
   `argus-app` repo.
3. Set **Framework Preset** to **Other** (Auto-detect works too).
4. Set the following environment variables:
   | Variable | Value |
   |---|---|
   | `API_URL` | URL of your deployed engine (e.g. `https://argus-engine.onrender.com`) |
5. Deploy — Vercel runs `yarn build` and serves the output.

### Via CLI

```bash
npx vercel --prod
```

Vercel will prompt you to log in and link the project. Set `API_URL` when prompted
or in the dashboard.

### Environment Variables

| Variable | Required | Source |
|---|---|---|
| `API_URL` | Yes | Deployed engine URL (see engine README) |
