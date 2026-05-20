from __future__ import annotations

from dataclasses import dataclass


DEFAULT_ID2LABEL: dict[int, str] = {
    0: "Sadness",
    1: "Surprise",
    2: "Disgust",
    3: "Fear",
    4: "Anger",
    5: "Other",
    6: "Enjoyment",
}


@dataclass(frozen=True)
class EmotionMetadata:
    label: str
    display_label_vi: str
    emoji: str


EMOTION_METADATA: dict[str, EmotionMetadata] = {
    "Sadness": EmotionMetadata("Sadness", "Buồn", "😢"),
    "Surprise": EmotionMetadata("Surprise", "Ngạc nhiên", "😮"),
    "Disgust": EmotionMetadata("Disgust", "Ghê tởm", "🤢"),
    "Fear": EmotionMetadata("Fear", "Sợ hãi", "😨"),
    "Anger": EmotionMetadata("Anger", "Tức giận", "😡"),
    "Other": EmotionMetadata("Other", "Khác", "😐"),
    "Enjoyment": EmotionMetadata("Enjoyment", "Vui vẻ", "😊"),
}


def normalize_id2label(raw_id2label: dict[int | str, str] | None) -> dict[int, str]:
    if not raw_id2label:
        return DEFAULT_ID2LABEL

    normalized: dict[int, str] = {}
    for raw_key, label in raw_id2label.items():
        try:
            normalized[int(raw_key)] = label
        except (TypeError, ValueError):
            continue

    return normalized or DEFAULT_ID2LABEL


def ordered_labels(raw_id2label: dict[int | str, str] | None) -> list[str]:
    id2label = normalize_id2label(raw_id2label)
    return [id2label[index] for index in sorted(id2label)]


def get_metadata(label: str) -> EmotionMetadata:
    return EMOTION_METADATA.get(label, EmotionMetadata(label, label, "😐"))
