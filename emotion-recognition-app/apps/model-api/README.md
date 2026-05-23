---
title: Bilingual Emotion Recognition Model API
emoji: 😊
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
short_description: FastAPI service for Vietnamese and English emotion recognition
---

# Bilingual Emotion Recognition Model API

FastAPI inference service for Vietnamese and English emotion recognition.

## Models

- Vietnamese: `tazuneru/baseline-phobert-vsmec-emotion-recognition`
- English: `tazuneru/roberta-emotion-english`

The Vietnamese loader keeps the required pattern:

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

repo_id = "tazuneru/baseline-phobert-vsmec-emotion-recognition"

tokenizer = AutoTokenizer.from_pretrained(repo_id)
model = AutoModelForSequenceClassification.from_pretrained(repo_id)
```

The English loader uses the required pattern:

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained("tazuneru/roberta-emotion-english")
tokenizer = AutoTokenizer.from_pretrained("tazuneru/roberta-emotion-english")
```

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check with per-language model status |
| `POST` | `/predict` | Predict emotion for a single text |
| `POST` | `/predict-batch` | Predict emotions for multiple texts |

## Predict

```bash
curl -X POST https://<your-space-url>/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "I am so happy today", "language": "en"}'
```

## Response

```json
{
  "label": "joy",
  "predictedLabel": "joy",
  "displayLabel": "Joy",
  "displayLabelVi": "Vui vẻ",
  "emoji": "😊",
  "confidence": 0.94,
  "scores": {
    "joy": 0.94
  },
  "scoreItems": [],
  "language": "en",
  "modelName": "tazuneru/roberta-emotion-english",
  "modelVersion": "main"
}
```

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `MODEL_NAME` | `tazuneru/baseline-phobert-vsmec-emotion-recognition` | Legacy Vietnamese model env var; kept for compatibility. |
| `VI_MODEL_NAME` | `tazuneru/baseline-phobert-vsmec-emotion-recognition` | Vietnamese model repo. |
| `EN_MODEL_NAME` | `tazuneru/roberta-emotion-english` | English model repo. |
| `DEFAULT_LANGUAGE` | `vi` | Default request language. |
| `SUPPORTED_LANGUAGES` | `vi,en` | Comma-separated supported languages. |
| `PRELOAD_LANGUAGES` | `vi` | Languages loaded at startup; English loads lazily by default. |
| `DEVICE` | `cpu` | `cpu`, `cuda`, or `mps`. |
| `MAX_TOKENS` | `256` | Max tokenizer length. |
| `MAX_TEXT_LENGTH` | `700` | Max input characters. |
| `CORS_ORIGIN` | `*` | Allowed CORS origins. |
| `LOG_LEVEL` | `INFO` | Logging level. |

Loading both models can significantly increase RAM usage. Keep `PRELOAD_LANGUAGES=vi` on small hosts and allow English to load lazily on the first English request.
