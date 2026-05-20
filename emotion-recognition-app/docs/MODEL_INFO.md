# Model Info

## Hugging Face Repository

`tazuneru/baseline-phobert-vsmec-emotion-recognition`

## Required Loading Method

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

repo_id = "tazuneru/baseline-phobert-vsmec-emotion-recognition"

tokenizer = AutoTokenizer.from_pretrained(repo_id)
model = AutoModelForSequenceClassification.from_pretrained(repo_id)
```

## Runtime Dependencies

- Python 3.10 or newer recommended.
- FastAPI.
- Uvicorn.
- PyTorch.
- Transformers.
- Pydantic.
- python-dotenv.

## Label Mapping

The existing model config exposes:

| ID | Label |
| --- | --- |
| 0 | Sadness |
| 1 | Surprise |
| 2 | Disgust |
| 3 | Fear |
| 4 | Anger |
| 5 | Other |
| 6 | Enjoyment |

The application respects this mapping and adds Vietnamese display labels and emojis.

## Runtime Notes

- The service loads tokenizer and model once through a singleton-style loader.
- Inference uses `torch.no_grad()`.
- Probabilities are produced with `torch.softmax`.
- `MAX_TOKENS` defaults to `256`.
- `DEVICE` defaults to `cpu`; GPU is used only when explicitly configured and available.
- Cold starts may be slow because model files must be downloaded or loaded into memory.
