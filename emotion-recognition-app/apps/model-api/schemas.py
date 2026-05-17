from __future__ import annotations

import os

from pydantic import BaseModel, Field, field_validator


MAX_TEXT_LENGTH = int(os.getenv("MAX_TEXT_LENGTH", "700"))


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_TEXT_LENGTH)

    @field_validator("text")
    @classmethod
    def strip_text(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("Text is required.")
        return text


class BatchTextItem(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_TEXT_LENGTH)

    @field_validator("text")
    @classmethod
    def strip_text(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("Text is required.")
        return text


class PredictBatchRequest(BaseModel):
    items: list[BatchTextItem] = Field(..., min_length=1, max_length=200)


class ScoreItem(BaseModel):
    label: str
    displayLabelVi: str
    emoji: str
    score: float


class PredictionResponse(BaseModel):
    predictedLabel: str
    displayLabelVi: str
    emoji: str
    confidence: float
    scores: list[ScoreItem]


class BatchPredictionItem(BaseModel):
    inputText: str
    prediction: PredictionResponse


class PredictBatchResponse(BaseModel):
    results: list[BatchPredictionItem]


class HealthResponse(BaseModel):
    success: bool
    service: str
    status: str
    modelLoaded: bool
    modelName: str
    device: str
    labels: list[str]
