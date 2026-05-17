# Node.js API Specification

Base URL: `http://localhost:4000`

## GET /health

Returns service status.

```json
{
  "success": true,
  "service": "emotion-recognition-api",
  "status": "ok"
}
```

## POST /api/emotions/analyze

Request:

```json
{
  "text": "hôm nay tôi rất vui",
  "source": "web"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "inputText": "hôm nay tôi rất vui",
    "predictedLabel": "Enjoyment",
    "displayLabelVi": "Vui vẻ",
    "emoji": "😊",
    "confidence": 0.92,
    "scores": [
      { "label": "Sadness", "displayLabelVi": "Buồn", "emoji": "😢", "score": 0.01 }
    ],
    "createdAt": "2026-05-18T00:00:00.000Z"
  }
}
```

## POST /api/emotions/batch

Multipart form-data:

- `file`: CSV file.

Expected CSV column: `text`.

Response:

```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "status": "queued",
    "totalRows": 12
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

## GET /api/jobs/:jobId

Returns batch job status.

## GET /api/jobs/:jobId/results

Returns per-row batch results.

## Error Envelope

```json
{
  "success": false,
  "message": "Unable to analyze the text at the moment. Please try again."
}
```
