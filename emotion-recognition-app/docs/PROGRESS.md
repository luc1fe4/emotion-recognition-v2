# Progress Log

## 2026-05-18

### Completed

- Inspected the repository and confirmed Git is initialized.
- Confirmed the worktree started clean on `main`.
- Read the immutable model config from `emotion_recognition_model_v1/config.json`.
- Confirmed model label order from `id2label`: Sadness, Surprise, Disgust, Fear, Anger, Other, Enjoyment.
- Created the `emotion-recognition-app/` monorepo workspace structure.
- Added root and app ignore rules for environments, dependencies, build output, caches, and uploads.
- Added Docker Compose for local PostgreSQL and Redis.
- Added initial documentation baseline.
- Implemented the FastAPI model API under `apps/model-api/`.
- Added real Transformers model loading with the required Hugging Face repository.
- Added `/health`, `/predict`, and `/predict-batch`.
- Added input validation, safe validation errors, safe model-unavailable errors, singleton-style model loading, softmax probability output, and Vietnamese label metadata.

### Currently Running

- Building the Express API, Prisma schema, shared contracts, and Next.js frontend around the existing immutable model assets.

### Decisions

- The existing `emotion_recognition_model_v1/` directory is read-only for this implementation.
- The application source lives under `emotion-recognition-app/` so model assets remain isolated.
- The architecture is 3-Tier + Client-Server with a separated FastAPI inference service.
- Clean Architecture is not used.

### Blockers And Handling

- `python` and `py` are not available on PATH in the current shell. The real model service will still be implemented, and model runtime validation will be marked blocked until Python is installed or exposed on PATH.
- PowerShell blocks `npm.ps1`; Node package commands should use `npm.cmd` on this Windows environment.

### Test Results

- `git rev-parse --is-inside-work-tree`: passed.
- `git status --short --branch`: clean before changes.
- `node --version`: passed with `v22.17.1`.
- `python --version`: failed because Python is not installed or not on PATH.
- `py --version`: failed because no Python launcher is installed.
- Static model API check: confirmed `repo_id`, `AutoTokenizer.from_pretrained`, `AutoModelForSequenceClassification.from_pretrained`, `torch.no_grad`, and `torch.softmax` are present in the inference path.
- Model API runtime check: blocked because Python is not installed or not on PATH.

### Commits

- `261f0be` - `docs: add project architecture baseline`
