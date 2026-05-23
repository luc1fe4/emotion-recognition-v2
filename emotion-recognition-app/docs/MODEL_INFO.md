# Model Info

The model API supports two languages through a registry keyed by `language`.

## Vietnamese

- Language: `vi`
- Model repo: `tazuneru/baseline-phobert-vsmec-emotion-recognition`
- Runtime: PhoBERT/RoBERTa sequence classification through Transformers.

Required loading method:

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

repo_id = "tazuneru/baseline-phobert-vsmec-emotion-recognition"

tokenizer = AutoTokenizer.from_pretrained(repo_id)
model = AutoModelForSequenceClassification.from_pretrained(repo_id)
```

Known Vietnamese config labels from the existing immutable local model config:

| ID | Label |
| --- | --- |
| 0 | Sadness |
| 1 | Surprise |
| 2 | Disgust |
| 3 | Fear |
| 4 | Anger |
| 5 | Other |
| 6 | Enjoyment |

## English

- Language: `en`
- Model repo: `tazuneru/roberta-emotion-english`
- Runtime: RoBERTa sequence classification through Transformers.

Required loading method:

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained("tazuneru/roberta-emotion-english")
tokenizer = AutoTokenizer.from_pretrained("tazuneru/roberta-emotion-english")
```

The English model labels are read from `model.config.id2label` at runtime. A fallback mapping for common RoBERTa emotion labels is present only for degraded metadata display before config labels are available; runtime labels remain the source of truth.

## Normalized Output

Both languages return:

- `label` and `predictedLabel`
- `displayLabel`
- `displayLabelVi`
- `emoji`
- `confidence`
- `scores` as a label-to-probability object
- `scoreItems` as chart-friendly rows
- `language`
- `modelName`
- `modelVersion`

## Runtime Notes

- Models are loaded once per language and are never reloaded on every request.
- Vietnamese preloads by default through `PRELOAD_LANGUAGES=vi`.
- English loads lazily on the first English request unless included in `PRELOAD_LANGUAGES`.
- Inference uses `torch.no_grad()` and `torch.softmax`.
- `MAX_TOKENS` defaults to `256`.
- `DEVICE` defaults to `cpu`; `cuda` and `mps` are used only when configured and available.
- Loading both models can significantly increase RAM usage and cold-start time.
