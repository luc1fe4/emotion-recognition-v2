from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from model_loader import ModelUnavailableError, get_model_service
from schemas import (
    BatchPredictionItem,
    HealthResponse,
    PredictBatchRequest,
    PredictBatchResponse,
    PredictionResponse,
    PredictRequest,
)


logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("emotion-recognition-model-api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    service = get_model_service()
    try:
        service.load()
    except ModelUnavailableError:
        logger.error("Model API started without a loaded model; prediction endpoints will return safe errors.")
    yield


app = FastAPI(
    title="Vietnamese Emotion Recognition Model API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGIN", "http://localhost:4000").split(","),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.exception_handler(ModelUnavailableError)
async def model_unavailable_handler(request: Request, exc: ModelUnavailableError) -> JSONResponse:
    logger.error("Model unavailable", extra={"path": request.url.path, "reason": str(exc)})
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Unable to analyze the text at the moment. Please try again."},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning("Invalid model API request", extra={"path": request.url.path, "errors": exc.errors()})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Please provide valid Vietnamese text within the allowed length."},
    )


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    service = get_model_service()
    return HealthResponse(
        success=True,
        service="emotion-recognition-model-api",
        status="ok" if service.is_loaded else "degraded",
        modelLoaded=service.is_loaded,
        modelName=service.settings.model_name,
        device=str(service.device),
        labels=service.labels,
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(payload: PredictRequest) -> PredictionResponse:
    return get_model_service().predict(payload.text)


@app.post("/predict-batch", response_model=PredictBatchResponse)
async def predict_batch(payload: PredictBatchRequest) -> PredictBatchResponse:
    results: list[BatchPredictionItem] = []
    service = get_model_service()

    for item in payload.items:
        prediction = service.predict(item.text)
        results.append(BatchPredictionItem(inputText=item.text, prediction=prediction))

    return PredictBatchResponse(results=results)


@app.get("/")
async def root() -> dict[str, str]:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Use /health, /predict, or /predict-batch.")
