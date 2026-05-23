# Model API Specification

Base URL: `http://localhost:8000`

## GET /health

Response:

```json
{
  "success": true,
  "service": "emotion-recognition-model-api",
  "status": "ok",
  "modelLoaded": true,
  "defaultLanguage": "vi",
  "supportedLanguages": ["vi", "en"],
  "device": "cpu",
  "models": [
    {
      "language": "vi",
      "modelName": "tazuneru/baseline-phobert-vsmec-emotion-recognition",
      "modelVersion": "main",
      "loaded": true,
      "labels": ["Sadness", "Surprise"],
      "loadError": null
    }
  ]
}
```

`modelLoaded` reports whether the default language model is loaded. Per-language load status is available in `models`.

## POST /predict

Vietnamese request:

```json
{
  "text": "hôm nay tôi rất vui",
  "language": "vi"
}
```

English request:

```json
{
  "text": "I am so happy today",
  "language": "en"
}
```

If `language` is omitted, the service defaults to `vi`.

Response:

```json
{
  "label": "joy",
  "predictedLabel": "joy",
  "displayLabel": "Joy",
  "displayLabelVi": "Vui vẻ",
  "emoji": "😊",
  "confidence": 0.95,
  "scores": {
    "anger": 0.01,
    "joy": 0.95
  },
  "scoreItems": [
    {
      "label": "joy",
      "displayLabel": "Joy",
      "displayLabelVi": "Vui vẻ",
      "emoji": "😊",
      "score": 0.95
    }
  ],
  "language": "en",
  "modelName": "tazuneru/roberta-emotion-english",
  "modelVersion": "main"
}
```

## POST /predict-batch

Request:

```json
{
  "items": [
    { "text": "hôm nay tôi rất vui", "language": "vi" },
    { "text": "I am so happy today", "language": "en" }
  ]
}
```

Response:

```json
{
  "results": [
    {
      "inputText": "I am so happy today",
      "language": "en",
      "prediction": {
        "label": "joy",
        "predictedLabel": "joy",
        "displayLabel": "Joy",
        "displayLabelVi": "Vui vẻ",
        "emoji": "😊",
        "confidence": 0.95,
        "scores": {},
        "scoreItems": [],
        "language": "en",
        "modelName": "tazuneru/roberta-emotion-english",
        "modelVersion": "main"
      }
    }
  ]
}
```

## Safe Errors

Unsupported language:

```json
{
  "detail": "Unsupported language. Use 'vi' or 'en'."
}
```

Model unavailable:

```json
{
  "detail": "Unable to analyze the text at the moment. Please try again."
}
```
