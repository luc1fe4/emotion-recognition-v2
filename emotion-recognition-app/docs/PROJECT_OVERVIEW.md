# Project Overview

## Problem

Vietnamese and English social media comments often mix formal text, informal spelling, emojis, slang, and abbreviations. The platform classifies that noisy text into emotion labels and presents the result in a product-quality web interface.

## Target Users

- Students and researchers exploring Vietnamese and English emotion classification.
- Product teams reviewing customer sentiment and emotional tone.
- Moderation and social listening workflows that need quick single-text or CSV-based analysis.

## Core Features

- Single-text emotion analysis with language selection.
- Predicted emotion, Vietnamese label, emoji, confidence score, and full score distribution.
- Model metadata showing language, Hugging Face model, and model version.
- History backed by PostgreSQL.
- CSV upload workflow prepared for queue-backed batch processing.
- Clear operational documentation for local development and deployment.

## Architecture Roadmap

1. Stage 1: 3-Tier + Client-Server architecture.
2. Stage 2: Separate FastAPI model inference service.
3. Stage 3: Redis/BullMQ event-driven CSV batch processing with per-row language support.
4. Stage 4: Gradual microservice split only if the project grows enough to justify it.

Clean Architecture is intentionally out of scope for the current size and timeline.
