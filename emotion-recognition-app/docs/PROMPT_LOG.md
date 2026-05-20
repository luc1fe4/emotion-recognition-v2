# Prompt Log

## Initial Build Prompt

The project request is to build an end-to-end Vietnamese social media emotion recognition web application using:

- Next.js frontend.
- Node.js Express backend.
- FastAPI model API.
- PostgreSQL database.
- Redis/BullMQ for CSV batch processing when feasible.
- Real Hugging Face model `tazuneru/baseline-phobert-vsmec-emotion-recognition`.

## Agent Decisions

- Do not modify `emotion_recognition_model_v1/`.
- Use the model config label mapping as the canonical label order.
- Implement real inference code only; no fake model responses or placeholder predictions.
- Use a pragmatic route-controller-service backend structure.
- Keep documentation current as implementation and validation progress.
- Use Next canary only after npm audit confirmed the stable Next line still carried production advisories.
- Treat missing Python runtime as an environment blocker, not a reason to mock model inference.

## Major Generated Outputs

- FastAPI model API with real Hugging Face loading and softmax inference.
- Express API with validation, logging, safe errors, Prisma persistence, CSV upload, and BullMQ worker support.
- Next.js frontend with analyzer, result visualization, batch upload, export, and history.
- PostgreSQL/Redis Docker Compose and environment examples.
