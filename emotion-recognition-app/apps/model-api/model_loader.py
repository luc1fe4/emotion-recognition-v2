from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from threading import Lock

import torch
from dotenv import load_dotenv
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from emotion_mapping import get_metadata, ordered_labels
from schemas import PredictionResponse, ScoreItem


load_dotenv()

logger = logging.getLogger("emotion-recognition-model-api")

REQUIRED_REPO_ID = "tazuneru/baseline-phobert-vsmec-emotion-recognition"


class ModelUnavailableError(RuntimeError):
    pass


@dataclass(frozen=True)
class ModelSettings:
    model_name: str
    requested_device: str
    max_tokens: int


def get_settings() -> ModelSettings:
    return ModelSettings(
        model_name=os.getenv("MODEL_NAME", REQUIRED_REPO_ID),
        requested_device=os.getenv("DEVICE", "cpu").lower(),
        max_tokens=int(os.getenv("MAX_TOKENS", "256")),
    )


def resolve_device(requested_device: str) -> torch.device:
    if requested_device == "cuda":
        if torch.cuda.is_available():
            return torch.device("cuda")
        logger.warning("DEVICE=cuda requested but CUDA is unavailable; falling back to CPU.")
        return torch.device("cpu")

    if requested_device == "mps":
        mps_backend = getattr(torch.backends, "mps", None)
        if mps_backend and mps_backend.is_available():
            return torch.device("mps")
        logger.warning("DEVICE=mps requested but MPS is unavailable; falling back to CPU.")
        return torch.device("cpu")

    return torch.device("cpu")


class EmotionModelService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.device = resolve_device(self.settings.requested_device)
        self.tokenizer = None
        self.model = None
        self.labels: list[str] = []
        self.load_error: str | None = None
        self._lock = Lock()

    @property
    def is_loaded(self) -> bool:
        return self.tokenizer is not None and self.model is not None

    def load(self) -> None:
        if self.is_loaded:
            return

        with self._lock:
            if self.is_loaded:
                return

            try:
                repo_id = "tazuneru/baseline-phobert-vsmec-emotion-recognition"
                if self.settings.model_name != repo_id:
                    logger.warning(
                        "MODEL_NAME differs from the required model; loading the required repository.",
                        extra={"configured_model": self.settings.model_name, "required_model": repo_id},
                    )

                tokenizer = AutoTokenizer.from_pretrained(repo_id)
                model = AutoModelForSequenceClassification.from_pretrained(repo_id)

                model.to(self.device)
                model.eval()

                self.tokenizer = tokenizer
                self.model = model
                self.labels = ordered_labels(getattr(model.config, "id2label", None))
                self.load_error = None

                logger.info(
                    "Loaded emotion recognition model",
                    extra={
                        "model_name": repo_id,
                        "device": str(self.device),
                        "labels": self.labels,
                    },
                )
            except Exception as exc:
                self.load_error = str(exc)
                logger.exception("Failed to load emotion recognition model")
                raise ModelUnavailableError(
                    "Unable to load the emotion recognition model."
                ) from exc

    def predict(self, text: str) -> PredictionResponse:
        try:
            self.load()
        except ModelUnavailableError:
            raise
        except Exception as exc:
            logger.exception("Unexpected model loading failure")
            raise ModelUnavailableError("Unable to load the emotion recognition model.") from exc

        if self.tokenizer is None or self.model is None:
            raise ModelUnavailableError("The emotion recognition model is unavailable.")

        try:
            encoded = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=self.settings.max_tokens,
                padding=True,
            )
            encoded = {key: value.to(self.device) for key, value in encoded.items()}

            with torch.no_grad():
                outputs = self.model(**encoded)
                probabilities = torch.softmax(outputs.logits, dim=-1)[0].detach().cpu()

            labels = self.labels or ordered_labels(getattr(self.model.config, "id2label", None))
            scores: list[ScoreItem] = []

            for index, probability in enumerate(probabilities.tolist()):
                label = labels[index] if index < len(labels) else f"LABEL_{index}"
                metadata = get_metadata(label)
                scores.append(
                    ScoreItem(
                        label=metadata.label,
                        displayLabelVi=metadata.display_label_vi,
                        emoji=metadata.emoji,
                        score=float(probability),
                    )
                )

            predicted_index = int(torch.argmax(probabilities).item())
            predicted = scores[predicted_index]

            return PredictionResponse(
                predictedLabel=predicted.label,
                displayLabelVi=predicted.displayLabelVi,
                emoji=predicted.emoji,
                confidence=predicted.score,
                scores=scores,
            )
        except ModelUnavailableError:
            raise
        except Exception as exc:
            logger.exception("Model inference failed", extra={"text_length": len(text)})
            raise ModelUnavailableError(
                "Unable to analyze the text at the moment. Please try again."
            ) from exc


_service = EmotionModelService()


def get_model_service() -> EmotionModelService:
    return _service
