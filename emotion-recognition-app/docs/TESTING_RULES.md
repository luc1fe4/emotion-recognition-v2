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

- Analyzer accepts Vietnamese and English text.
- Language selector switches between Vietnamese and English.
- Analyzer sends `language` in requests.
- Loading, error, and result states render clearly.
- Batch upload rejects non-CSV files.
- Batch upload accepts a batch-level language and row-level `language` column.
- History loads safely even when empty.
- History shows language and model metadata.
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
- `POST /api/emotions/analyze` with English examples.
- `POST /api/emotions/analyze` rejects invalid languages.
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

- `hôm nay tôi rất vui` with `language: "vi"`
- `tôi buồn quá` with `language: "vi"`
- `thật là bực mình` with `language: "vi"`
- `I am so happy today` with `language: "en"`
- `I am angry about this` with `language: "en"`
- Invalid language such as `fr`
- Empty text
- Too-long text

Confirm real probabilities are returned. Confirm each response includes `language`, `modelName`, and `modelVersion`.

## Integration

- Frontend calls the Node.js backend.
- Node.js backend calls FastAPI.
- Frontend does not call the model API directly.
- Vietnamese and English flows both route through the Node.js backend.
- End-to-end analysis returns real model output when Python dependencies and network/model cache are available.
