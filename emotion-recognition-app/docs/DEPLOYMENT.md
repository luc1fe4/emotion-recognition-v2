# Deployment

## Frontend: Vercel

- Project directory: `emotion-recognition-app/apps/web`.
- Vercel config: `apps/web/vercel.json`.
- Install command: `cd ../.. && npm install` (runs from monorepo root).
- Build command: `cd ../.. && npm --workspace @emotion-recognition/shared run build && npm --workspace @emotion-recognition/web run build`.
- Output directory: `.next`.
- Environment variables:
  - `NEXT_PUBLIC_API_URL=https://<railway-api-url>` — must point to the Railway backend.
- **Production URL:** `https://emotion-recognition-v2-five.vercel.app`
- `transpilePackages: ["@emotion-recognition/shared"]` is set in `next.config.mjs` so Next.js/webpack transpiles the shared CJS package directly, preventing `zod` from being undefined in the browser bundle.

## Backend: Railway

- Project directory: `emotion-recognition-app/` (monorepo root).
- Build and start configured via `nixpacks.toml`.
- Install phase uses `npm install --include=dev` so `tsc` is available during build; dev deps are pruned afterwards with `npm prune --omit=dev`.
- `app.set("trust proxy", 1)` is set in Express so `express-rate-limit` can correctly identify client IPs behind Railway's reverse proxy.
- **Production URL:** `https://charming-abundance-production-eda1.up.railway.app`
- Required environment variables on Railway:
  - `DATABASE_URL` — Railway PostgreSQL connection string.
  - `REDIS_URL` — Railway Redis connection string.
  - `MODEL_API_URL` — HuggingFace Space API URL (e.g. `https://lcphuc-emotion-model-api.hf.space`).
  - `CORS_ORIGIN` — comma-separated allowed origins, must include the Vercel frontend URL (e.g. `http://localhost:3000,https://emotion-recognition-v2-five.vercel.app`).
  - `LOG_LEVEL=info`
  - `NODE_ENV=production`
  - `MAX_TEXT_LENGTH=700`
  - `CSV_MAX_FILE_SIZE_MB=5`
  - `DEFAULT_LANGUAGE=vi`
  - `SUPPORTED_LANGUAGES=vi,en`

## Model API: Hugging Face Spaces

- Repository: `https://huggingface.co/spaces/lcphuc/emotion-model-api`.
- Runtime: Docker (see `Dockerfile` in the `emotion-model-api-space/` repo).
- **Production URL:** `https://lcphuc-emotion-model-api.hf.space`
- The HF cache directory is set to `/home/appuser/.cache/huggingface` (not `/app/.cache`) to avoid a `PermissionError` when the non-root `appuser` attempts to download the model at startup.
- Cold start can take 1–3 minutes while the PhoBERT model is downloaded and loaded into memory. Check `/health` — `modelLoaded` must be `true` before predictions work.
- Free-tier Spaces may sleep after inactivity. The first request after waking will trigger a cold start.
- Bilingual model environment variables:
  - `VI_MODEL_NAME=tazuneru/baseline-phobert-vsmec-emotion-recognition`
  - `EN_MODEL_NAME=tazuneru/roberta-emotion-english`
  - `DEFAULT_LANGUAGE=vi`
  - `SUPPORTED_LANGUAGES=vi,en`
  - `PRELOAD_LANGUAGES=vi`
- Loading both models with `PRELOAD_LANGUAGES=vi,en` can significantly increase RAM usage and cold-start time. Keep English lazy-loaded on small HF Spaces.

## Database

Use Railway PostgreSQL (already configured). Migrations run automatically at container start via `npx prisma migrate deploy`. Enable backups and monitor connection limits.

## Redis

Use Railway Redis (already configured). BullMQ needs a Redis endpoint reachable from the backend worker process.
