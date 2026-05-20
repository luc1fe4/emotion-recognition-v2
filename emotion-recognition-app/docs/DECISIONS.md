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
- Respect `id2label` from the model config when available.
- Never fallback to mock predictions.

## Batch Processing

- Use BullMQ with Redis for batch jobs.
- Keep a synchronous fallback for development only when Redis is unavailable, while still returning real model API results if the model service is available.

## Frontend Dependency Security

- Use the current Next canary `16.3.0-canary.21` because the latest stable release available during implementation, `16.2.6`, still produced production `npm audit` findings through Next's nested PostCSS dependency.
- Keep the PostCSS override in the root package file until the stable Next line resolves the advisory cleanly.
- Revisit this decision before production deployment and prefer a stable patched Next release when one is published.

## Database

- PostgreSQL is the source of truth for analysis history, batch jobs, and batch results.
- Store probabilities as JSON because score keys are stable but model output is naturally map-like.

## Out Of Scope

- Retraining, regenerating, moving, or reconfiguring model files.
- User authentication.
- Full microservice decomposition.
