# Deployment

## Frontend: Vercel

- Project directory: `emotion-recognition-app/apps/web`.
- Install command: `npm install`.
- Build command: `npm run build`.
- Environment:
  - `NEXT_PUBLIC_API_URL=https://your-api.example.com`

Current frontend package note: `next@16.3.0-canary.21` is used to satisfy production `npm audit` while the latest stable Next release remains flagged for a nested PostCSS advisory. Pin or upgrade to the first stable patched Next release before long-lived production deployment.

## Backend: Render, Railway, Fly.io, VPS

- Project directory: `emotion-recognition-app/apps/api`.
- Build command: `npm install && npm run prisma:generate && npm run build`.
- Start command: `npm run start`.
- Environment:
  - `DATABASE_URL`
  - `REDIS_URL`
  - `MODEL_API_URL`
  - `CORS_ORIGIN`
  - `LOG_LEVEL`
  - `NODE_ENV=production`

Run Prisma migrations during deployment with `npm run prisma:migrate`.

## Model API

- Project directory: `emotion-recognition-app/apps/model-api`.
- Python version: 3.10 or newer recommended.
- Install command: `pip install -r requirements.txt`.
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- Environment:
  - `MODEL_NAME=tazuneru/baseline-phobert-vsmec-emotion-recognition`
  - `DEVICE=cpu` or `cuda` when supported.
  - `MAX_TOKENS=256`
  - `MAX_TEXT_LENGTH=700`

Cold starts may be slow because the tokenizer and model must load. CPU deployment is acceptable for low-volume demos; GPU is recommended for higher throughput.

## Database

Use Supabase, Neon, Railway PostgreSQL, or a managed PostgreSQL equivalent. Enable backups and monitor connection limits.

## Redis

Use Upstash, Railway Redis, Redis Cloud, or self-hosted Redis. BullMQ needs a Redis endpoint reachable from the backend and worker.
