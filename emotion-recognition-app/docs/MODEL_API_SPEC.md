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
  "device": "cpu"
}
```

## POST /predict

Request:

```json
{
  "text": "hôm nay tôi rất vui"
}
```

Response:

```json
{
  "predictedLabel": "Enjoyment",
  "displayLabelVi": "Vui vẻ",
  "emoji": "😊",
  "confidence": 0.92,
  "scores": [
    {
      "label": "Enjoyment",
      "displayLabelVi": "Vui vẻ",
      "emoji": "😊",
      "score": 0.92
    }
  ]
}
```

## POST /predict-batch

Request:

```json
{
  "items": [
    { "text": "hôm nay tôi rất vui" },
    { "text": "tôi buồn quá" }
  ]
}
```

Response:

```json
{
  "results": [
    {
      "inputText": "hôm nay tôi rất vui",
      "prediction": {
        "predictedLabel": "Enjoyment",
        "displayLabelVi": "Vui vẻ",
        "emoji": "😊",
        "confidence": 0.92,
        "scores": []
      }
    }
  ]
}
```

## Safe Error

```json
{
  "detail": "Unable to analyze the text at the moment. Please try again."
}
```
