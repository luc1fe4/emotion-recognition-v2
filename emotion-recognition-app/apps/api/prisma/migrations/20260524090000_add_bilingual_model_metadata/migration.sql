ALTER TABLE "EmotionAnalysis"
ADD COLUMN "displayLabel" TEXT NOT NULL DEFAULT '',
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'vi',
ADD COLUMN "modelName" TEXT NOT NULL DEFAULT 'tazuneru/baseline-phobert-vsmec-emotion-recognition',
ADD COLUMN "modelVersion" TEXT NOT NULL DEFAULT 'main';

ALTER TABLE "BatchJob"
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'vi';

ALTER TABLE "BatchResult"
ADD COLUMN "displayLabel" TEXT,
ADD COLUMN "scoreItemsJson" JSONB,
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'vi',
ADD COLUMN "modelName" TEXT,
ADD COLUMN "modelVersion" TEXT;

CREATE INDEX "EmotionAnalysis_language_idx" ON "EmotionAnalysis"("language");
CREATE INDEX "EmotionAnalysis_modelName_idx" ON "EmotionAnalysis"("modelName");
