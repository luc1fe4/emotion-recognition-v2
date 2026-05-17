# Database Schema

Database: PostgreSQL through Prisma.

## EmotionAnalysis

- `id`: UUID primary key.
- `inputText`: original input text.
- `predictedLabel`: model label.
- `displayLabelVi`: Vietnamese display label.
- `emoji`: display emoji.
- `confidence`: highest probability.
- `scoresJson`: full probability distribution.
- `source`: source such as `web`, `csv`, or `api`.
- `createdAt`: creation time.

Indexes:

- `createdAt`
- `predictedLabel`

## BatchJob

- `id`: UUID primary key.
- `status`: `queued`, `processing`, `completed`, `failed`, or `completed_with_errors`.
- `fileName`: uploaded file name.
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
- `displayLabelVi`: nullable on row failure.
- `emoji`: nullable on row failure.
- `confidence`: nullable on row failure.
- `scoresJson`: nullable JSON distribution.
- `errorMessage`: nullable safe row-level error.
- `createdAt`: creation time.

Indexes:

- `batchJobId`
- Unique pair: `batchJobId`, `rowIndex`
