# Maintenance

## Logs

- Backend logs use Winston and Morgan.
- Model API logs model loading and inference failures.
- Avoid logging full user text in high-volume production environments.

## Monitoring

- Monitor API latency, model inference latency, error rate, queue depth, and database connection usage.
- Alert on repeated model API failures and stalled BullMQ jobs.
- Check HF Space `/health` endpoint periodically. `modelLoaded` reports the default language; inspect the `models` array for per-language status.

## Backups

- Enable daily PostgreSQL backups.
- Keep Redis as queue infrastructure, not the source of truth.

## Model Update Process

1. Review the new model repository and label mapping.
2. Validate on representative Vietnamese and English social media examples.
3. Update documentation.
4. Deploy the model API separately.
5. Do not overwrite the immutable `emotion_recognition_model_v1/` folder without explicit approval.

## Troubleshooting

- **Model loading fails on HF Space (`modelLoaded: false`)** — check that `HF_HOME` is set to a directory writable by the container user (e.g. `/home/appuser/.cache/huggingface`). A `PermissionError` on `/app/.cache` means the cache path is owned by root. Push a Dockerfile fix and let the Space rebuild.
- **English request is slow the first time** — English loads lazily by default. This avoids loading two large models on startup but causes the first English request after cold start to take longer.
- **HF Space runs out of memory** — keep `PRELOAD_LANGUAGES=vi`, use CPU lazy loading, or move to a larger Space/GPU/VPS. Do not replace the model with mock predictions.
- **Backend returns 503** — check Railway logs for `Model API request failed`. Verify `MODEL_API_URL` is set to the correct HF Space URL and that the Space is running (not sleeping or building). The first request after a cold start may time out; wait and retry.
- **CORS blocked on frontend** — verify `CORS_ORIGIN` on Railway includes the exact Vercel origin (no trailing slash). Multiple origins are comma-separated.
- **`express-rate-limit` throws `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`** — ensure `app.set("trust proxy", 1)` is present in `app.ts` before any rate limiting middleware.
- **Railway build fails with `tsc: not found`** — ensure `nixpacks.toml` install phase uses `npm install --include=dev` so devDependencies (including TypeScript) are installed before the build step.
- **Next.js browser bundle: `Cannot read properties of undefined (reading 'parseAsync')`** — ensure `transpilePackages: ["@emotion-recognition/shared"]` is present in `next.config.mjs`. This forces webpack to process the shared CJS module through its transform pipeline instead of treating it as an external pre-compiled module.
- **Node.js runtime: `ERR_UNKNOWN_FILE_EXTENSION .ts`** — remove any `"import"` export condition in `packages/shared/package.json` that points to a `.ts` source file. Node.js ESM uses the `import` condition at runtime and cannot execute TypeScript directly.
- If history is unavailable, check `DATABASE_URL`, migrations, and PostgreSQL connectivity.
- If batch jobs stay queued, check `REDIS_URL`, worker process status, and BullMQ logs.
- If frontend dependency audit starts failing around Next canary or PostCSS, check the stable Next release line and update the pin once a stable patched release is available.
