from __future__ import annotations

import os
from typing import Literal

from pydantic import BaseModel, Field, field_validator


MAX_TEXT_LENGTH = int(os.getenv("MAX_TEXT_LENGTH", "700"))
DEFAULT_LANGUAGE = os.getenv("DEFAULT_LANGUAGE", "vi")
SUPPORTED_LANGUAGES = tuple(
    language.strip()
    for language in os.getenv("SUPPORTED_LANGUAGES", "vi,en").split(",")
    if language.strip()
)


Language = Literal["vi", "en"]


def normalize_language(value: str | None) -> str:
    language = (value or DEFAULT_LANGUAGE).strip().lower()
    if language not in SUPPORTED_LANGUAGES:
        raise ValueError("Unsupported language.")
    if language not in {"vi", "en"}:
        raise ValueError("Unsupported language.")
    return language


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_TEXT_LENGTH)
    language: str = Field(default=DEFAULT_LANGUAGE)

    @field_validator("text")
    @classmethod
    def strip_text(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("Text is required.")
        return text

    @field_validator("language")
    @classmethod
    def validate_language(cls, value: str) -> str:
        return normalize_language(value)


class BatchTextItem(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_TEXT_LENGTH)
    language: str | None = None

    @field_validator("text")
    @classmethod
    def strip_text(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("Text is required.")
        return text

    @field_validator("language")
    @classmethod
    def validate_language(cls, value: str | None) -> str:
        return normalize_language(value)


class PredictBatchRequest(BaseModel):
    items: list[BatchTextItem] = Field(..., min_length=1, max_length=200)


class ScoreItem(BaseModel):
    label: str
    displayLabel: str
    displayLabelVi: str
    emoji: str
    score: float


class PredictionResponse(BaseModel):
    label: str
    predictedLabel: str
    displayLabel: str
    displayLabelVi: str
    emoji: str
    confidence: float
    scores: dict[str, float]
    scoreItems: list[ScoreItem]
    language: Language
    modelName: str
    modelVersion: str


class BatchPredictionItem(BaseModel):
    inputText: str
    language: Language
    prediction: PredictionResponse


class PredictBatchResponse(BaseModel):
    results: list[BatchPredictionItem]


class ModelHealthItem(BaseModel):
    language: Language
    modelName: str
    modelVersion: str
    loaded: bool
    labels: list[str]
    loadError: str | None = None


class HealthResponse(BaseModel):
    success: bool
    service: str
    status: str
    modelLoaded: bool
    defaultLanguage: Language
    supportedLanguages: list[Language]
    device: str
    models: list[ModelHealthItem]
