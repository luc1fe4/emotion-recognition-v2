# Database Schema

Database: PostgreSQL through Prisma.

## EmotionAnalysis

- `id`: UUID primary key.
- `inputText`: original input text.
- `predictedLabel`: model label.
- `displayLabel`: English display label.
- `displayLabelVi`: Vietnamese display label.
- `emoji`: display emoji.
- `confidence`: highest probability.
- `scoresJson`: full probability distribution as JSON.
- `language`: `vi` or `en`, default `vi`.
- `modelName`: Hugging Face model repository.
- `modelVersion`: model revision label, default `main`.
- `source`: source such as `web`, `csv`, or `api`.
- `createdAt`: creation time.

Indexes:

- `createdAt`
- `predictedLabel`
- `language`
- `modelName`

## BatchJob

- `id`: UUID primary key.
- `status`: `queued`, `processing`, `completed`, `failed`, or `completed_with_errors`.
- `fileName`: uploaded file name.
- `language`: batch-level default language, default `vi`.
- `totalRows`: CSV row count.
- `processedRows`: processed count.
- `failedRows`: failed count.
- `createdAt`: creation time.
- `updatedAt`: update time.

Indexes:

- `status`

## BatchResult

- `id`: UUID primary key.
- `batchJobId`: foreign key to `BatchJob`.
- `rowIndex`: row number in the CSV.
- `inputText`: text from CSV row.
- `predictedLabel`: nullable on row failure.
- `displayLabel`: nullable on row failure.
- `displayLabelVi`: nullable on row failure.
- `emoji`: nullable on row failure.
- `confidence`: nullable on row failure.
- `scoresJson`: nullable JSON score map.
- `scoreItemsJson`: nullable chart-friendly scores.
- `language`: row language, default `vi`.
- `modelName`: nullable model repository.
- `modelVersion`: nullable model revision.
- `errorMessage`: nullable safe row-level error.
- `createdAt`: creation time.

Indexes:

- `batchJobId`
- Unique pair: `batchJobId`, `rowIndex`

## Migration Notes

The bilingual migration is additive only. Existing rows are preserved and receive defaults:

- `language = 'vi'`
- `modelName = 'tazuneru/baseline-phobert-vsmec-emotion-recognition'`
- `modelVersion = 'main'`
