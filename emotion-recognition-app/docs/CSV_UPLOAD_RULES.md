# CSV Upload Rules

## Format

- File type: `.csv`.
- Required column: `text`.
- Encoding: UTF-8 recommended.
- Each row should contain one Vietnamese social media text sample.

Example:

```csv
text
hôm nay tôi rất vui
tôi buồn quá
thật là bực mình
```

## Limits

- Default maximum file size: 5 MB.
- Empty files are rejected.
- Files without a `text` column are rejected.
- Empty `text` values are marked as row failures.
- Text values longer than the configured limit are marked as row failures.

## Processing Behavior

- With Redis configured, uploads create a BullMQ job.
- Without Redis in local development, the API can process rows immediately so the UI remains usable.
- Results are stored in PostgreSQL when the database is available.
- Each row returns either a prediction or a safe row-level error message.

## Export

The frontend exports available result rows to CSV with prediction fields appended.
