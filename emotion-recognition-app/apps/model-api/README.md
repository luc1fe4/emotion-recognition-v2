# Model API

FastAPI service for real Vietnamese emotion recognition inference with:

`tazuneru/baseline-phobert-vsmec-emotion-recognition`

The loader uses the required Transformers pattern:

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

repo_id = "tazuneru/baseline-phobert-vsmec-emotion-recognition"

tokenizer = AutoTokenizer.from_pretrained(repo_id)
model = AutoModelForSequenceClassification.from_pretrained(repo_id)
```

In the implementation, `MODEL_NAME` defaults to that same repository ID.

## Run Locally

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Endpoints

- `GET /health`
- `POST /predict`
- `POST /predict-batch`

## Example

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"hôm nay tôi rất vui\"}"
```

## Environment

Copy `.env.example` to `.env` for local settings.

- `MODEL_NAME`: Hugging Face model repository.
- `DEVICE`: `cpu`, `cuda`, or `mps`.
- `MAX_TOKENS`: tokenizer truncation length.
- `MAX_TEXT_LENGTH`: request text length limit.
- `LOG_LEVEL`: Python logging level.

The service does not return mock predictions. If the model cannot load, prediction endpoints return a safe `503` error.
