# Node.js API Specification

Base URL: `http://localhost:4000`

## GET /health

Returns service status.

```json
{
  "success": true,
  "service": "emotion-recognition-api",
  "status": "ok",
  "modelApiUrl": "http://localhost:8000"
}
```

## POST /api/emotions/analyze

Vietnamese request:

```json
{
  "text": "hôm nay tôi rất vui",
  "language": "vi",
  "source": "web"
}
```

English request:

```json
{
  "text": "I am so happy today",
  "language": "en",
  "source": "web"
}
```

If `language` is omitted, it defaults to `vi` for backward compatibility.

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "inputText": "I am so happy today",
    "label": "joy",
    "predictedLabel": "joy",
    "displayLabel": "Joy",
    "displayLabelVi": "Vui vẻ",
    "emoji": "😊",
    "confidence": 0.95,
    "scores": {
      "joy": 0.95
    },
    "scoreItems": [],
    "language": "en",
    "modelName": "tazuneru/roberta-emotion-english",
    "modelVersion": "main",
    "source": "web",
    "createdAt": "2026-05-24T00:00:00.000Z"
  }
}
```

## POST /api/emotions/batch

Multipart form-data:

- `file`: CSV file.
- `language`: optional batch-level default, `vi` or `en`.

Expected CSV column: `text`.

Optional CSV column: `language`. Row-level language overrides the batch-level value.

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "jobId": "uuid",
    "status": "queued",
    "language": "vi",
    "totalRows": 12,
    "queueMode": "redis"
  }
}
```

## GET /api/emotions/history

Query parameters:

- `limit`: default `20`, max `100`.
- `cursor`: optional ISO date cursor.

Response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "nextCursor": null
  }
}
```

Each item includes `language`, `modelName`, and `modelVersion`.

## GET /api/jobs/:jobId

Returns batch job status.

## GET /api/jobs/:jobId/results

Returns per-row batch results with language and model metadata.

## Error Envelope

```json
{
  "success": false,
  "message": "Unable to analyze the text at the moment. Please try again."
}
```
