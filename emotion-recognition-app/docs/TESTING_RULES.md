# Testing Rules

## Frontend

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

On Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`.

Manual checks:

- Analyzer accepts Vietnamese text and shows loading, error, and result states.
- Batch upload rejects non-CSV files.
- History loads safely even when empty.
- Layout works on mobile and desktop.

## Backend

Run:

```bash
npm run lint
npm run typecheck
npm run test
```

On Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`.

Manual checks:

- `GET /health`.
- `POST /api/emotions/analyze` with Vietnamese examples.
- `POST /api/emotions/batch` with valid and invalid CSV.
- `GET /api/emotions/history`.
- `GET /api/jobs/:jobId`.
- `GET /api/jobs/:jobId/results`.

## Model API

Run:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Manual examples:

- `hôm nay tôi rất vui`
- `tôi buồn quá`
- `thật là bực mình`
- `tôi sợ điều này`
- `ghê quá`
- `bất ngờ thật`

Confirm real probabilities are returned.

## Integration

- Frontend calls the Node.js backend.
- Node.js backend calls FastAPI.
- Frontend does not call the model API directly.
- End-to-end analysis returns real model output when Python dependencies and network/model cache are available.
