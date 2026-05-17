# Emotion Labels

The model config in `emotion_recognition_model_v1/config.json` contains `id2label` and `label2id`. The application respects the config order.

| Model ID | Label | Vietnamese Label | Emoji |
| --- | --- | --- | --- |
| 0 | Sadness | Buồn | 😢 |
| 1 | Surprise | Ngạc nhiên | 😮 |
| 2 | Disgust | Ghê tởm | 🤢 |
| 3 | Fear | Sợ hãi | 😨 |
| 4 | Anger | Tức giận | 😡 |
| 5 | Other | Khác | 😐 |
| 6 | Enjoyment | Vui vẻ | 😊 |

## Notes

- Backend and frontend use the same public label names.
- Scores are returned for every label.
- Confidence is the highest softmax probability.
