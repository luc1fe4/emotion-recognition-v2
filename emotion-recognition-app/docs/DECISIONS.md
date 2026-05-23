# Decisions

## Architecture

- Use a 3-Tier + Client-Server application:
  - Presentation: Next.js web.
  - Application API: Express.js backend.
  - Model service: FastAPI.
  - Persistence: PostgreSQL through Prisma.
- Keep model inference separate from the Node.js API so the Python ML runtime can scale and deploy independently.
- Do not use Clean Architecture. The project is better served by clear modules and route-controller-service boundaries.

## Model

- Use `AutoTokenizer.from_pretrained(repo_id)` and `AutoModelForSequenceClassification.from_pretrained(repo_id)` with `repo_id = "tazuneru/baseline-phobert-vsmec-emotion-recognition"`.
- Add English support with `AutoModelForSequenceClassification.from_pretrained("tazuneru/roberta-emotion-english")` and `AutoTokenizer.from_pretrained("tazuneru/roberta-emotion-english")`.
- Respect `id2label` from the model config when available.
- Never fallback to mock predictions.
- Use a model registry keyed by `language` instead of replacing the Vietnamese implementation.
- Preload Vietnamese by default and load English lazily to reduce memory pressure on small hosts.

## Batch Processing

- Use BullMQ with Redis for batch jobs.
- Keep a synchronous fallback for development only when Redis is unavailable, while still returning real model API results if the model service is available.

## Frontend Dependency Security

- Use the current Next canary `16.3.0-canary.21` because the latest stable release available during implementation, `16.2.6`, still produced production `npm audit` findings through Next's nested PostCSS dependency.
- Keep the PostCSS override in the root package file until the stable Next line resolves the advisory cleanly.
- Revisit this decision before production deployment and prefer a stable patched Next release when one is published.

## Shared Package Module Format

- The `@emotion-recognition/shared` package compiles to CommonJS (`dist/index.js`) only.
- Do not add an `"import"` export condition pointing to `.ts` source — Node.js ESM runtime also resolves the `import` condition and cannot load `.ts` files directly, causing `ERR_UNKNOWN_FILE_EXTENSION`.
- The `"source"` field is kept for bundler tooling that supports it but is ignored by the Node.js runtime.
- `transpilePackages: ["@emotion-recognition/shared"]` in `next.config.mjs` ensures webpack processes the CJS dist through its transform pipeline for the browser bundle, resolving the `zod` undefined runtime error.

## Express Trust Proxy

- Set `app.set("trust proxy", 1)` in the Express application before any middleware that reads client IPs.
- Railway (and most PaaS platforms) sit behind a reverse proxy that adds `X-Forwarded-For`. Without trust proxy, `express-rate-limit` throws `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` and cannot identify clients correctly.

## Railway Build (nixpacks)

- Use `npm install --include=dev` during the install phase so `tsc` (in devDependencies) is available for the build step.
- Run `npm prune --omit=dev` after the build to remove devDependencies from the final image, keeping the runtime image lean.
- Set `DATABASE_URL` to a dummy value during the build phase so `prisma generate` does not fail on the Railway build runner where the real database is not reachable.

## HuggingFace Spaces Cache Directory

- Set `HF_HOME=/home/appuser/.cache/huggingface` (not `/app/.cache`).
- The `/app` directory in the Docker image is owned by root. After switching to `appuser`, writing to `/app/.cache` causes a `PermissionError` that silently prevents model loading, leaving the Space in `degraded` status.
- `/home/appuser` is created by `useradd -m` and is writable by `appuser`.

## Database

- PostgreSQL is the source of truth for analysis history, batch jobs, and batch results.
- Store probabilities as JSON because score keys are stable but model output is naturally map-like.
- Add bilingual metadata fields additively: `language`, `modelName`, and `modelVersion`.

## Out Of Scope

- Retraining, regenerating, moving, or reconfiguring model files.
- User authentication.
- Full microservice decomposition.
