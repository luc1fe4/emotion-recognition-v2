from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from threading import Lock

import torch
from dotenv import load_dotenv
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from emotion_mapping import get_metadata, ordered_labels
from schemas import ModelHealthItem, PredictionResponse, ScoreItem, normalize_language


load_dotenv()

logger = logging.getLogger("emotion-recognition-model-api")

VI_REPO_ID = "tazuneru/baseline-phobert-vsmec-emotion-recognition"
EN_REPO_ID = "tazuneru/roberta-emotion-english"
MODEL_VERSION = "main"


class ModelUnavailableError(RuntimeError):
    pass


class UnsupportedLanguageError(ValueError):
    pass


@dataclass(frozen=True)
class ModelSettings:
    requested_device: str
    max_tokens: int
    default_language: str
    preload_languages: tuple[str, ...]


@dataclass(frozen=True)
class ModelDefinition:
    language: str
    model_name: str
    model_version: str


def get_settings() -> ModelSettings:
    default_language = normalize_language(os.getenv("DEFAULT_LANGUAGE", "vi"))
    preload_languages = tuple(
        normalize_language(language)
        for language in os.getenv("PRELOAD_LANGUAGES", default_language).split(",")
        if language.strip()
    )

    return ModelSettings(
        requested_device=os.getenv("DEVICE", "cpu").lower(),
        max_tokens=int(os.getenv("MAX_TOKENS", "256")),
        default_language=default_language,
        preload_languages=preload_languages,
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


MODEL_DEFINITIONS: dict[str, ModelDefinition] = {
    "vi": ModelDefinition("vi", VI_REPO_ID, os.getenv("VI_MODEL_VERSION", MODEL_VERSION)),
    "en": ModelDefinition("en", EN_REPO_ID, os.getenv("EN_MODEL_VERSION", MODEL_VERSION)),
}


def _warn_if_env_model_differs(language: str, expected_model: str) -> None:
    env_key = f"{language.upper()}_MODEL_NAME"
    configured_model = os.getenv(env_key)
    legacy_model = os.getenv("MODEL_NAME") if language == "vi" else None
    requested = configured_model or legacy_model

    if requested and requested != expected_model:
        logger.warning(
            "Configured model differs from the required model; loading the required repository.",
            extra={"language": language, "configured_model": requested, "required_model": expected_model},
        )


def _load_transformers_model(language: str):
    if language == "vi":
        repo_id = "tazuneru/baseline-phobert-vsmec-emotion-recognition"
        _warn_if_env_model_differs(language, repo_id)
        tokenizer = AutoTokenizer.from_pretrained(repo_id)
        model = AutoModelForSequenceClassification.from_pretrained(repo_id)
        return tokenizer, model

    if language == "en":
        _warn_if_env_model_differs(language, "tazuneru/roberta-emotion-english")
        model = AutoModelForSequenceClassification.from_pretrained("tazuneru/roberta-emotion-english")
        tokenizer = AutoTokenizer.from_pretrained("tazuneru/roberta-emotion-english")
        return tokenizer, model

    raise UnsupportedLanguageError(f"Unsupported language: {language}")


class EmotionModelRuntime:
    def __init__(self, definition: ModelDefinition, device: torch.device, max_tokens: int) -> None:
        self.definition = definition
        self.device = device
        self.max_tokens = max_tokens
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
                tokenizer, model = _load_transformers_model(self.definition.language)

                model.to(self.device)
                model.eval()

                self.tokenizer = tokenizer
                self.model = model
                self.labels = ordered_labels(getattr(model.config, "id2label", None), self.definition.language)
                self.load_error = None

                logger.info(
                    "Loaded emotion recognition model",
                    extra={
                        "language": self.definition.language,
                        "model_name": self.definition.model_name,
                        "device": str(self.device),
                        "labels": self.labels,
                    },
                )
            except UnsupportedLanguageError:
                raise
            except Exception as exc:
                self.load_error = str(exc)
                logger.exception(
                    "Failed to load emotion recognition model",
                    extra={"language": self.definition.language, "model_name": self.definition.model_name},
                )
                raise ModelUnavailableError("Unable to load the emotion recognition model.") from exc

    def predict(self, text: str) -> PredictionResponse:
        self.load()

        if self.tokenizer is None or self.model is None:
            raise ModelUnavailableError("The emotion recognition model is unavailable.")

        try:
            encoded = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=self.max_tokens,
                padding=True,
            )
            encoded = {key: value.to(self.device) for key, value in encoded.items()}

            with torch.no_grad():
                outputs = self.model(**encoded)
                probabilities = torch.softmax(outputs.logits, dim=-1)[0].detach().cpu()

            labels = self.labels or ordered_labels(getattr(self.model.config, "id2label", None), self.definition.language)
            score_items: list[ScoreItem] = []
            score_map: dict[str, float] = {}

            for index, probability in enumerate(probabilities.tolist()):
                label = labels[index] if index < len(labels) else f"LABEL_{index}"
                metadata = get_metadata(label)
                score = float(probability)
                score_map[metadata.label] = score
                score_items.append(
                    ScoreItem(
                        label=metadata.label,
                        displayLabel=metadata.display_label,
                        displayLabelVi=metadata.display_label_vi,
                        emoji=metadata.emoji,
                        score=score,
                    )
                )

            predicted_index = int(torch.argmax(probabilities).item())
            predicted = score_items[predicted_index]

            return PredictionResponse(
                label=predicted.label,
                predictedLabel=predicted.label,
                displayLabel=predicted.displayLabel,
                displayLabelVi=predicted.displayLabelVi,
                emoji=predicted.emoji,
                confidence=predicted.score,
                scores=score_map,
                scoreItems=score_items,
                language=self.definition.language,  # type: ignore[arg-type]
                modelName=self.definition.model_name,
                modelVersion=self.definition.model_version,
            )
        except ModelUnavailableError:
            raise
        except Exception as exc:
            logger.exception(
                "Model inference failed",
                extra={"language": self.definition.language, "text_length": len(text)},
            )
            raise ModelUnavailableError("Unable to analyze the text at the moment. Please try again.") from exc

    def health(self) -> ModelHealthItem:
        return ModelHealthItem(
            language=self.definition.language,  # type: ignore[arg-type]
            modelName=self.definition.model_name,
            modelVersion=self.definition.model_version,
            loaded=self.is_loaded,
            labels=self.labels,
            loadError=self.load_error,
        )


class EmotionModelRegistry:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.device = resolve_device(self.settings.requested_device)
        self.runtimes = {
            language: EmotionModelRuntime(definition, self.device, self.settings.max_tokens)
            for language, definition in MODEL_DEFINITIONS.items()
        }

    def preload(self) -> None:
        for language in self.settings.preload_languages:
            try:
                self.get_runtime(language).load()
            except ModelUnavailableError:
                logger.error(
                    "Model API started with an unloaded model; prediction endpoints for this language will return safe errors.",
                    extra={"language": language},
                )

    def get_runtime(self, language: str) -> EmotionModelRuntime:
        try:
            normalized_language = normalize_language(language)
        except ValueError as exc:
            raise UnsupportedLanguageError("Unsupported language.") from exc

        runtime = self.runtimes.get(normalized_language)
        if runtime is None:
            raise UnsupportedLanguageError("Unsupported language.")
        return runtime

    def predict(self, text: str, language: str) -> PredictionResponse:
        return self.get_runtime(language).predict(text)

    @property
    def default_loaded(self) -> bool:
        return self.get_runtime(self.settings.default_language).is_loaded

    def health(self) -> list[ModelHealthItem]:
        return [runtime.health() for runtime in self.runtimes.values()]


_registry = EmotionModelRegistry()


def get_model_service() -> EmotionModelRegistry:
    return _registry
