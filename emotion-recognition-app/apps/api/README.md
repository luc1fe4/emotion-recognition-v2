# Node.js API

Express TypeScript application API for Vietnamese emotion recognition.

## Responsibilities

- Validate requests with Zod.
- Apply Helmet, CORS, and rate limiting.
- Log HTTP requests with Morgan and structured events with Winston.
- Call the FastAPI model service through `MODEL_API_URL`, forwarding `language`.
- Persist analysis history and CSV batch results with Prisma/PostgreSQL.
- Process CSV uploads through Redis/BullMQ when configured.

## Run Locally

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Run the batch worker in another terminal when using Redis queue mode:

```bash
npm run worker
```

## Checks

```bash
npm run typecheck
npm run test
npm run build
```

## Endpoints

- `GET /health`
- `POST /api/emotions/analyze`
- `POST /api/emotions/batch`
- `GET /api/emotions/history`
- `GET /api/jobs/:jobId`
- `GET /api/jobs/:jobId/results`

The API does not return model mocks. If the model service is unavailable, it returns a safe user-facing error and logs technical detail internally. Requests without `language` default to `vi` for backward compatibility.
