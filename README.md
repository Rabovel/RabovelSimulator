# Raboovel Earn

A full-stack Nigerian stock trading and staking platform built from the Raboovel Technical PRD. Trade NGX-listed equities (Dangote, MTN, GTCO, Zenith Bank, and more) with NGN wallets.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4 |
| Backend | Express.js 5, TypeScript |
| Database | Neon PostgreSQL via Prisma ORM |
| Auth | JWT, bcrypt, TOTP MFA (otplib) |
| Security | Helmet, CORS, rate limiting, audit logs |

## Architecture

The PRD specifies microservices (Auth, Portfolio, Staking, Rewards, Wallet, Notifications, Analytics). This implementation uses a modular Express monolith with route modules that map cleanly to those services — ready to split into separate services later.

**Database entities:** Users, KYC, Wallets, Holdings, Stakes, Rewards, Transactions, Audit Logs, Notifications

**User flows:** Registration → KYC → Funding → Stock Purchase → Stake Creation → Reward Distribution

## Project Structure

```
apps/
  api/          Express REST API
  web/          Next.js frontend
packages/
  db/           Prisma schema & client
```

## Getting Started

### 1. Neon Database

1. Create a project at [neon.tech](https://neon.tech)
2. Copy your connection string

### 2. Environment

```bash
# apps/api/.env
cp apps/api/.env.example apps/api/.env
# Set DATABASE_URL and JWT_SECRET

# apps/web/.env.local
cp apps/web/.env.example apps/web/.env.local
```

### 3. Install & Setup

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:4000

### Demo Account

After seeding, admin: `admin@rabovel.com` / `password123` → `/admin/users` (KYC review at `/admin/kyc`). Admins cannot access user trading features.

### Flutterwave Deposits

1. Create a [Flutterwave](https://flutterwave.com) account and get test API keys from the [developer settings](https://dashboard.flutterwave.com/settings/developers).
2. Add keys to `apps/api/.env`:
   ```
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-...
   FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
   FLUTTERWAVE_WEBHOOK_SECRET=your-secret-hash
   ```
3. Set webhook URL in Flutterwave dashboard to `https://your-api-domain/api/webhooks/flutterwave` (use [ngrok](https://ngrok.com) for local dev).
4. Deposit flow: user initiates → redirected to Flutterwave → webhook + polling confirms → wallet credited in real time.

**Test card:** `5531886652142950` · CVV `564` · Expiry `09/32` · PIN `3310` · OTP `12345`

## API Endpoints

| Service | Endpoints |
|---------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, MFA setup |
| KYC | `GET /api/kyc/status`, `POST /api/kyc/submit` |
| Admin KYC | `GET /api/admin/kyc`, `PATCH /api/admin/kyc/:id/approve`, `PATCH /api/admin/kyc/:id/reject` |
| Admin Users | `GET /api/admin/users/metrics` |
| Wallet | `GET /api/wallet`, `POST /api/wallet/deposit/initiate`, `POST /api/wallet/withdraw`, `GET /api/wallet/deposit/:ref/status`, `GET /api/wallet/transactions` |
| Webhooks | `POST /api/webhooks/flutterwave` |
| Portfolio | `GET /api/portfolio/market`, `GET /api/portfolio/holdings`, `POST /api/portfolio/purchase` |
| Staking | `GET /api/staking`, `POST /api/staking/create` |
| Rewards | `GET /api/rewards` |
| Analytics | `GET /api/analytics/summary` |
| Notifications | `GET /api/notifications` |

## Deploy on Vercel

The Next.js app and Express API deploy together from `apps/web` (Express runs via the Next.js catch-all route at `src/pages/api/[[...path]].ts`).

### 1. Import repository

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), **Add New Project** → import the repo.
3. Set **Root Directory** to `apps/web` (required — Vercel reads `apps/web/vercel.json`).

**CLI deploy** (from repo root):

```bash
npm run vercel:deploy
```

Do **not** run `vercel --prod` from the repo root without Root Directory set — it will fail looking for a `public` folder.

### 2. Environment variables

Add these in the Vercel project **Settings → Environment Variables**:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Neon pooled URL (`?pgbouncer=true&connect_timeout=30&pool_timeout=0`) |
| `DIRECT_URL` | Neon direct URL (no `-pooler` host) |
| `JWT_SECRET` | Long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `CRON_SECRET` | Random string for daily staking cron |
| `CORS_ORIGIN` | `https://your-app.vercel.app` (or custom domain) |
| `FLUTTERWAVE_PUBLIC_KEY` | Optional |
| `FLUTTERWAVE_SECRET_KEY` | Optional |
| `FLUTTERWAVE_WEBHOOK_SECRET` | Optional |
| `FLUTTERWAVE_ENCRYPTION_KEY` | Optional |

Leave `NEXT_PUBLIC_API_URL` unset on Vercel — the frontend calls `/api` on the same domain.

### 3. Database

Run migrations against Neon before first deploy:

```bash
npm run db:push
npm run db:seed
```

### 4. Flutterwave webhook

Set webhook URL to `https://your-app.vercel.app/api/webhooks/flutterwave`.

### 5. Deploy

Click **Deploy**. Cron runs daily at 02:00 UTC (`/api/cron/staking-rewards`) on Vercel Pro; Hobby supports cron with limits.

## Docker

```bash
docker compose up --build
```

Set `DATABASE_URL` and `JWT_SECRET` in a root `.env` file before running.
