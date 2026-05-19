-- CreateTable
CREATE TABLE "EmotionAnalysis" (
    "id" UUID NOT NULL,
    "inputText" TEXT NOT NULL,
    "predictedLabel" TEXT NOT NULL,
    "displayLabelVi" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "scoresJson" JSONB NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'web',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmotionAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchJob" (
    "id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "fileName" TEXT,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "processedRows" INTEGER NOT NULL DEFAULT 0,
    "failedRows" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchResult" (
    "id" UUID NOT NULL,
    "batchJobId" UUID NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "inputText" TEXT NOT NULL,
    "predictedLabel" TEXT,
    "displayLabelVi" TEXT,
    "emoji" TEXT,
    "confidence" DOUBLE PRECISION,
    "scoresJson" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatchResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmotionAnalysis_createdAt_idx" ON "EmotionAnalysis"("createdAt");

-- CreateIndex
CREATE INDEX "EmotionAnalysis_predictedLabel_idx" ON "EmotionAnalysis"("predictedLabel");

-- CreateIndex
CREATE INDEX "BatchJob_status_idx" ON "BatchJob"("status");

-- CreateIndex
CREATE INDEX "BatchResult_batchJobId_idx" ON "BatchResult"("batchJobId");

-- CreateIndex
CREATE UNIQUE INDEX "BatchResult_batchJobId_rowIndex_key" ON "BatchResult"("batchJobId", "rowIndex");

-- AddForeignKey
ALTER TABLE "BatchResult" ADD CONSTRAINT "BatchResult_batchJobId_fkey" FOREIGN KEY ("batchJobId") REFERENCES "BatchJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
