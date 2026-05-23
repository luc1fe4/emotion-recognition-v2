from __future__ import annotations

from dataclasses import dataclass


DEFAULT_ID2LABEL_BY_LANGUAGE: dict[str, dict[int, str]] = {
    "vi": {
        0: "Sadness",
        1: "Surprise",
        2: "Disgust",
        3: "Fear",
        4: "Anger",
        5: "Other",
        6: "Enjoyment",
    },
    "en": {
        0: "anger",
        1: "disgust",
        2: "fear",
        3: "joy",
        4: "neutral",
        5: "sadness",
        6: "surprise",
    },
}


@dataclass(frozen=True)
class EmotionMetadata:
    label: str
    display_label: str
    display_label_vi: str
    emoji: str


EMOTION_METADATA: dict[str, EmotionMetadata] = {
    "sadness": EmotionMetadata("sadness", "Sadness", "Bu\u1ed3n", "\U0001f622"),
    "Sadness": EmotionMetadata("Sadness", "Sadness", "Bu\u1ed3n", "\U0001f622"),
    "surprise": EmotionMetadata("surprise", "Surprise", "Ng\u1ea1c nhi\u00ean", "\U0001f62e"),
    "Surprise": EmotionMetadata("Surprise", "Surprise", "Ng\u1ea1c nhi\u00ean", "\U0001f62e"),
    "disgust": EmotionMetadata("disgust", "Disgust", "Gh\u00ea t\u1edfm", "\U0001f922"),
    "Disgust": EmotionMetadata("Disgust", "Disgust", "Gh\u00ea t\u1edfm", "\U0001f922"),
    "fear": EmotionMetadata("fear", "Fear", "S\u1ee3 h\u00e3i", "\U0001f628"),
    "Fear": EmotionMetadata("Fear", "Fear", "S\u1ee3 h\u00e3i", "\U0001f628"),
    "anger": EmotionMetadata("anger", "Anger", "T\u1ee9c gi\u1eadn", "\U0001f621"),
    "Anger": EmotionMetadata("Anger", "Anger", "T\u1ee9c gi\u1eadn", "\U0001f621"),
    "other": EmotionMetadata("other", "Other", "Kh\u00e1c", "\U0001f610"),
    "Other": EmotionMetadata("Other", "Other", "Kh\u00e1c", "\U0001f610"),
    "neutral": EmotionMetadata("neutral", "Neutral", "Kh\u00e1c", "\U0001f610"),
    "Enjoyment": EmotionMetadata("Enjoyment", "Enjoyment", "Vui v\u1ebb", "\U0001f60a"),
    "joy": EmotionMetadata("joy", "Joy", "Vui v\u1ebb", "\U0001f60a"),
    "love": EmotionMetadata("love", "Love", "Y\u00eau th\u00edch", "\u2764\ufe0f"),
}


def normalize_id2label(raw_id2label: dict[int | str, str] | None, language: str) -> dict[int, str]:
    if not raw_id2label:
        return DEFAULT_ID2LABEL_BY_LANGUAGE[language]

    normalized: dict[int, str] = {}
    for raw_key, label in raw_id2label.items():
        try:
            normalized[int(raw_key)] = label
        except (TypeError, ValueError):
            continue

    return normalized or DEFAULT_ID2LABEL_BY_LANGUAGE[language]


def ordered_labels(raw_id2label: dict[int | str, str] | None, language: str) -> list[str]:
    id2label = normalize_id2label(raw_id2label, language)
    return [id2label[index] for index in sorted(id2label)]


def get_metadata(label: str) -> EmotionMetadata:
    return EMOTION_METADATA.get(
        label,
        EMOTION_METADATA.get(label.lower(), EmotionMetadata(label, label, label, "\U0001f610")),
    )
