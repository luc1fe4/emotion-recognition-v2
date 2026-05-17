# Environment Variables

## Backend

| Variable | Example | Description |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://emotion_app:emotion_app_password@localhost:5432/emotion_recognition` | PostgreSQL connection string. |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string for BullMQ. |
| `NODE_ENV` | `development` | Runtime environment. |
| `PORT` | `4000` | Express server port. |
| `CORS_ORIGIN` | `http://localhost:3000` | Comma-separated allowed origins. |
| `MODEL_API_URL` | `http://localhost:8000` | FastAPI model service URL. |
| `LOG_LEVEL` | `info` | Winston log level. |
| `MAX_TEXT_LENGTH` | `700` | Backend text length limit. |
| `CSV_MAX_FILE_SIZE_MB` | `5` | CSV upload limit. |

## Frontend

| Variable | Example | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Public Node.js API base URL. |

## Model API

| Variable | Example | Description |
| --- | --- | --- |
| `MODEL_NAME` | `tazuneru/baseline-phobert-vsmec-emotion-recognition` | Hugging Face model ID. |
| `DEVICE` | `cpu` | `cpu`, `cuda`, or `mps` when available. |
| `MAX_TOKENS` | `256` | Token truncation length. |
| `MAX_TEXT_LENGTH` | `700` | Input text character limit. |
| `LOG_LEVEL` | `INFO` | Python log level. |

## Security Notes

- Do not commit real `.env` files.
- Keep database and Redis credentials out of frontend variables.
- Only expose variables prefixed with `NEXT_PUBLIC_` to the browser.
