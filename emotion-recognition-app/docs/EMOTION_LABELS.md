# Emotion Labels

The model API reads `model.config.id2label` at runtime for each language. Application metadata maps those actual labels to English display text, Vietnamese display text, and emojis.

## Vietnamese Model

Model: `tazuneru/baseline-phobert-vsmec-emotion-recognition`

The immutable local config contains:

| Model ID | Label | English Display | Vietnamese Display | Emoji |
| --- | --- | --- | --- | --- |
| 0 | Sadness | Sadness | Buồn | 😢 |
| 1 | Surprise | Surprise | Ngạc nhiên | 😮 |
| 2 | Disgust | Disgust | Ghê tởm | 🤢 |
| 3 | Fear | Fear | Sợ hãi | 😨 |
| 4 | Anger | Anger | Tức giận | 😡 |
| 5 | Other | Other | Khác | 😐 |
| 6 | Enjoyment | Enjoyment | Vui vẻ | 😊 |

## English Model

Model: `tazuneru/roberta-emotion-english`

The English model labels are not hard-coded as truth. They are inspected from the loaded model config. Metadata support is included for common English emotion labels:

| Label | English Display | Vietnamese Display | Emoji |
| --- | --- | --- | --- |
| anger | Anger | Tức giận | 😡 |
| disgust | Disgust | Ghê tởm | 🤢 |
| fear | Fear | Sợ hãi | 😨 |
| joy | Joy | Vui vẻ | 😊 |
| love | Love | Yêu thích | ❤️ |
| neutral | Neutral | Khác | 😐 |
| sadness | Sadness | Buồn | 😢 |
| surprise | Surprise | Ngạc nhiên | 😮 |

If the model returns a label not listed here, the API still returns that exact label and falls back to a neutral emoji/display string.

## Notes

- `scores` is the normalized label-to-probability object.
- `scoreItems` is the chart-friendly list derived from the same probabilities.
- Confidence is the highest softmax probability.
