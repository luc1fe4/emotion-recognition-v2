---
title: Vietnamese Emotion Recognition Model API
emoji: 😊
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
short_description: FastAPI service for Vietnamese emotion recognition using PhoBERT
---

# Vietnamese Emotion Recognition Model API

FastAPI inference service for Vietnamese emotion recognition using the PhoBERT-based model fine-tuned on VSMEC dataset.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — confirms model is loaded |
| `POST` | `/predict` | Predict emotion for a single Vietnamese text |
| `POST` | `/predict-batch` | Predict emotions for multiple texts |

## Usage

### Health check
```bash
curl https://<your-space-url>/health
```

### Predict
```bash
curl -X POST https://<your-space-url>/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Hôm nay tôi rất vui!"}'
```

### Response
```json
{
  "predictedLabel": "Enjoyment",
  "displayLabelVi": "Vui vẻ",
  "emoji": "😊",
  "confidence": 0.94,
  "scores": [...]
}
```

## Model

- **Model:** [tazuneru/baseline-phobert-vsmec-emotion-recognition](https://huggingface.co/tazuneru/baseline-phobert-vsmec-emotion-recognition)
- **Architecture:** PhoBERT (RoBERTa-based) fine-tuned for sequence classification
- **Labels:** Sadness, Surprise, Disgust, Fear, Anger, Other, Enjoyment
- **Language:** Vietnamese

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `MODEL_NAME` | `tazuneru/baseline-phobert-vsmec-emotion-recognition` | HuggingFace model repo |
| `DEVICE` | `cpu` | `cpu` or `cuda` |
| `MAX_TOKENS` | `256` | Max tokenizer length |
| `MAX_TEXT_LENGTH` | `700` | Max input characters |
| `CORS_ORIGIN` | `*` | Allowed CORS origins |
| `LOG_LEVEL` | `INFO` | Logging level |
