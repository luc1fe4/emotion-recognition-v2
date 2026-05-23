# Progress Log

## 2026-05-18

### Completed

- Inspected the repository and confirmed Git is initialized.
- Confirmed the worktree started clean on `main`.
- Read the immutable model config from `emotion_recognition_model_v1/config.json`.
- Confirmed model label order from `id2label`: Sadness, Surprise, Disgust, Fear, Anger, Other, Enjoyment.
- Created the `emotion-recognition-app/` monorepo workspace structure.
- Added root and app ignore rules for environments, dependencies, build output, caches, and uploads.
- Added Docker Compose for local PostgreSQL and Redis.
- Added initial documentation baseline.
- Implemented the FastAPI model API under `apps/model-api/`.
- Added real Transformers model loading with the required Hugging Face repository.
- Added `/health`, `/predict`, and `/predict-batch`.
- Added input validation, safe validation errors, safe model-unavailable errors, singleton-style model loading, softmax probability output, and Vietnamese label metadata.
- Implemented shared TypeScript emotion constants and Zod contracts under `packages/shared/`.
- Implemented the Express API under `apps/api/` with route-controller-service boundaries.
- Added security middleware, CORS by environment, rate limiting, Morgan HTTP logs, Winston structured logs, centralized errors, and safe JSON error envelopes.
- Added Prisma PostgreSQL schema for analysis history, batch jobs, and batch results with requested indexes.
- Added real model API client integration through `MODEL_API_URL`.
- Added CSV parsing, upload validation, BullMQ queue integration, worker entry point, and synchronous local fallback when Redis enqueue is unavailable.
- Added backend schema/CSV unit tests.
- Implemented the Next.js App Router frontend under `apps/web/`.
- Added polished responsive analyzer UI with loading, error, result, confidence, score distribution, batch upload, export, and history states.
- Added TanStack Query API integration, React Hook Form + Zod validation, Tailwind styling, shadcn-style UI primitives, Recharts probability charting, and frontend `.env.example`.
- Updated batch upload response to include `jobId` while preserving the database `id`.
- Disabled Next canary `agentRules` file generation to keep repository contents intentional.

### Currently Running

- Final validation, documentation updates, and Git commit.

### Decisions

- The existing `emotion_recognition_model_v1/` directory is read-only for this implementation.
- The application source lives under `emotion-recognition-app/` so model assets remain isolated.
- The architecture is 3-Tier + Client-Server with a separated FastAPI inference service.
- Clean Architecture is not used.
- The frontend currently uses `next@16.3.0-canary.21` because latest stable `16.2.6` was still flagged by `npm audit --omit=dev` for Next/PostCSS advisories. Revisit this when a stable patched Next release is available.

### Blockers And Handling

- `python` and `py` are not available on PATH in the current shell. The real model service will still be implemented, and model runtime validation will be marked blocked until Python is installed or exposed on PATH.
- PowerShell blocks `npm.ps1`; Node package commands should use `npm.cmd` on this Windows environment.
- The in-app browser could not navigate to `localhost` or `127.0.0.1` and returned `ERR_BLOCKED_BY_CLIENT`. Shell HTTP smoke tests were used for local frontend verification instead.

### Test Results

- `git rev-parse --is-inside-work-tree`: passed.
- `git status --short --branch`: clean before changes.
- `node --version`: passed with `v22.17.1`.
- `python --version`: failed because Python is not installed or not on PATH.
- `py --version`: failed because no Python launcher is installed.
- Static model API check: confirmed `repo_id`, `AutoTokenizer.from_pretrained`, `AutoModelForSequenceClassification.from_pretrained`, `torch.no_grad`, and `torch.softmax` are present in the inference path.
- Model API runtime check: blocked because Python is not installed or not on PATH.
- `npm.cmd install`: passed after switching local package linkage from `workspace:*` to `file:` because this npm build rejected the workspace protocol.
- `npm.cmd audit --omit=dev`: passed with 0 production vulnerabilities.
- `npm --workspace @emotion-recognition/shared run build`: passed.
- `npm --workspace @emotion-recognition/shared run typecheck`: passed.
- `npm --workspace @emotion-recognition/api run prisma:generate`: passed.
- `npm --workspace @emotion-recognition/api run typecheck`: initially failed on shared package resolution, Prisma event typing, and ioredis import style; fixed and reran successfully.
- `npm --workspace @emotion-recognition/api run test`: passed, 4 tests.
- `npm --workspace @emotion-recognition/api run build`: passed.
- Manual API health check against compiled server: passed, returned `{"success":true,"service":"emotion-recognition-api","status":"ok","modelApiUrl":"http://localhost:8000"}`.
- `npm --workspace @emotion-recognition/web run typecheck`: initially failed on React 19 typing conflicts with Radix Slot and Recharts 2.x; fixed by removing Radix Slot usage and upgrading Recharts to 3.8.1; reran successfully.
- `npm --workspace @emotion-recognition/web run build`: initially failed on the same React typing issue and then a server/client boundary around `buttonVariants`; fixed and reran successfully.
- `npm audit --omit=dev`: initially flagged Next stable and nested PostCSS advisories; upgraded to `next@16.3.0-canary.21` and added a PostCSS override; reran successfully with 0 production vulnerabilities.
- Frontend dev server smoke test: passed with HTTP 200 for `/` and `/history`.
- Browser visual smoke test: blocked by `ERR_BLOCKED_BY_CLIENT` for local URLs in the in-app browser.
- `docker --version`: passed with Docker 29.3.0, with a warning that the current user cannot read Docker config.
- `docker compose version`: passed with Docker Compose v5.1.0, with the same Docker config warning.
- `docker compose config --quiet`: passed.
- Safe model-unavailable API check: passed; `POST /api/emotions/analyze` returned `{"success":false,"message":"Unable to analyze the text at the moment. Please try again."}` when FastAPI was not running.
- Full monorepo `npm run lint`: passed.
- Full monorepo `npm run typecheck`: passed.
- Full monorepo `npm run test`: passed.
- Full monorepo `npm run build`: passed.

### Commits

- `261f0be` - `docs: add project architecture baseline`
- `34f18eb` - `feat(model-api): implement real PhoBERT inference service`
- `3ed353f` - `feat(api): add Express emotion analysis backend`
- `7e52322` - `feat(web): build emotion analysis interface`

## 2026-05-23

### Completed

- Deployed the full three-tier application to production:
  - **Model API** → Hugging Face Spaces (`https://lcphuc-emotion-model-api.hf.space`), Docker runtime.
  - **Backend API** → Railway (`https://charming-abundance-production-eda1.up.railway.app`), nixpacks build.
  - **Frontend** → Vercel (`https://emotion-recognition-v2-five.vercel.app`), Next.js.
- Diagnosed and fixed six production bugs encountered during and after deployment.

### Bugs Fixed

1. **`parseAsync` undefined in browser bundle** — The `@emotion-recognition/shared` package compiled to CommonJS. When Next.js bundled it for the browser, `zod` resolved incorrectly, making `parseAsync` undefined. Fixed by adding `transpilePackages: ["@emotion-recognition/shared"]` to `next.config.mjs` so webpack processes the CJS dist directly.

2. **CORS blocked on Vercel frontend** — `CORS_ORIGIN` on Railway only contained `http://localhost:3000`. Added `https://emotion-recognition-v2-five.vercel.app` to the comma-separated value via Railway dashboard.

3. **`ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`** — Railway's reverse proxy adds `X-Forwarded-For`. Fixed by adding `app.set("trust proxy", 1)` in `app.ts` before rate-limit middleware.

4. **`tsc: not found` on Railway build** — Production `npm install` skipped `devDependencies` (including `typescript`). Fixed in `nixpacks.toml`: changed install phase to `npm install --include=dev` and added `npm prune --omit=dev` after build.

5. **`ERR_UNKNOWN_FILE_EXTENSION .ts` at Node.js runtime** — An `"import": "./src/index.ts"` export condition was added for webpack but Node.js ESM runtime also resolves the `import` condition and cannot execute `.ts` files. Removed the condition; `"default": "./dist/index.js"` handles all Node.js consumers.

6. **HF Space `modelLoaded: false` / 503 from backend** — `HF_HOME` was set to `/app/.cache/huggingface`, which is owned by root after build. The non-root `appuser` got a `PermissionError` when attempting to download the model. Fixed by changing `HF_HOME` and `TRANSFORMERS_CACHE` to `/home/appuser/.cache/huggingface` and adding `chown -R appuser:appuser /app` in the Dockerfile.

### Commits

- `0615645` - `fix: use transpilePackages to resolve CJS/ESM zod conflict in browser bundle`
- `379c9dc` - `fix: add trust proxy for Railway reverse proxy (ERR_ERL_UNEXPECTED_X_FORWARDED_FOR)`
- `b916ad9` - `fix: install devDeps for build (tsc not found) then prune in nixpacks`
- `df6b36b` - `fix: revert import condition to dist/index.js to fix Node.js ESM runtime (ERR_UNKNOWN_FILE_EXTENSION .ts)`
- `36d29ae` - `fix: move HF cache to appuser home dir to fix PermissionError on model download` *(HF Space repo)*

