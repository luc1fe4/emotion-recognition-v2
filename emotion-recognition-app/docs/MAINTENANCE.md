# Maintenance

## Logs

- Backend logs use Winston and Morgan.
- Model API logs model loading and inference failures.
- Avoid logging full user text in high-volume production environments.

## Monitoring

- Monitor API latency, model inference latency, error rate, queue depth, and database connection usage.
- Alert on repeated model API failures and stalled BullMQ jobs.

## Backups

- Enable daily PostgreSQL backups.
- Keep Redis as queue infrastructure, not the source of truth.

## Model Update Process

1. Review the new model repository and label mapping.
2. Validate on representative Vietnamese social media examples.
3. Update documentation.
4. Deploy the model API separately.
5. Do not overwrite the immutable `emotion_recognition_model_v1/` folder without explicit approval.

## Troubleshooting

- If model loading fails, check Python version, PyTorch installation, network access to Hugging Face, disk space, and memory.
- If backend analysis fails, check `MODEL_API_URL`, model API health, and backend logs.
- If history is unavailable, check `DATABASE_URL`, migrations, and PostgreSQL connectivity.
- If batch jobs stay queued, check `REDIS_URL`, worker process status, and BullMQ logs.
- If frontend dependency audit starts failing around Next canary or PostCSS, check the stable Next release line and update the pin once a stable patched release is available.
