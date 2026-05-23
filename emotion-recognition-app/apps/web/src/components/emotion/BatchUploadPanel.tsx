"use client";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_LABELS,
  MAX_TEXT_LENGTH,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@emotion-recognition/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileUp, Globe2, Loader2, RefreshCw, UploadCloud } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { exportResultsCsv, getJob, getJobResults, uploadBatch } from "@/lib/api";
import { formatLanguageName, formatPercent, getErrorMessage } from "@/lib/utils";

const MAX_FILE_SIZE_MB = 5;
const ACTIVE_STATUSES = new Set(["queued", "processing"]);

export function BatchUploadPanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadBatch(file, language),
    onSuccess(data) {
      setJobId(data.jobId ?? data.id);
      void queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const jobQuery = useQuery({
    queryKey: ["batch-job", jobId],
    queryFn: () => getJob(jobId as string),
    enabled: Boolean(jobId),
    refetchInterval(query) {
      const status = query.state.data?.status;
      return status && ACTIVE_STATUSES.has(status) ? 2_000 : false;
    },
  });

  const jobStatus = jobQuery.data?.status;

  const resultsQuery = useQuery({
    queryKey: ["batch-results", jobId],
    queryFn: () => getJobResults(jobId as string),
    enabled: Boolean(jobId && jobStatus && !ACTIVE_STATUSES.has(jobStatus)),
  });

  const progress = useMemo(() => {
    if (!jobQuery.data || jobQuery.data.totalRows === 0) {
      return 0;
    }
    return Math.round((jobQuery.data.processedRows / jobQuery.data.totalRows) * 100);
  }, [jobQuery.data]);

  function handleFile(file: File | null) {
    setClientError(null);
    setSelectedFile(null);

    if (!file) {
      return;
    }

    const isCsv = file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
    if (!isCsv) {
      setClientError("Please choose a CSV file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setClientError(`File max is ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setSelectedFile(file);
  }

  const rows = resultsQuery.data?.items ?? [];
  const successfulRows = rows.filter((row) => row.predictedLabel);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-primary" />
              Batch CSV
            </CardTitle>
            <CardDescription>Column: text, optional language, max {MAX_TEXT_LENGTH} chars</CardDescription>
          </div>
          {jobQuery.data ? <Badge>{jobQuery.data.status}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Globe2 className="h-4 w-4 text-primary" />
            Batch default language
          </span>
          <div className="grid grid-cols-2 gap-2 rounded-md border bg-muted p-1">
            {SUPPORTED_LANGUAGES.map((option) => (
              <Button
                key={option}
                type="button"
                variant={language === option ? "default" : "ghost"}
                disabled={uploadMutation.isPending}
                onClick={() => setLanguage(option)}
              >
                {LANGUAGE_LABELS[option]}
              </Button>
            ))}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
        />

        <div className="flex flex-col gap-3 rounded-md border border-dashed bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{selectedFile?.name ?? "No file selected"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : `CSV, ${MAX_FILE_SIZE_MB} MB max`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" type="button" onClick={() => inputRef.current?.click()}>
              <FileUp className="h-4 w-4" />
              Choose
            </Button>
            <Button
              type="button"
              disabled={!selectedFile || uploadMutation.isPending}
              onClick={() => selectedFile && uploadMutation.mutate(selectedFile)}
            >
              {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              Upload
            </Button>
          </div>
        </div>

        {clientError || uploadMutation.isError ? (
          <div className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {clientError ?? getErrorMessage(uploadMutation.error)}
          </div>
        ) : null}

        {jobQuery.data ? (
          <div className="space-y-3 rounded-md border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">Rows processed</span>
              <span className="text-sm text-muted-foreground">
                {jobQuery.data.processedRows}/{jobQuery.data.totalRows}
              </span>
            </div>
            <Progress value={progress} />
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="rounded-md bg-muted px-2 py-2">
                <p className="text-lg font-semibold">{jobQuery.data.totalRows}</p>
                <p className="text-xs text-muted-foreground">Rows</p>
              </div>
              <div className="rounded-md bg-muted px-2 py-2">
                <p className="text-lg font-semibold">{successfulRows.length}</p>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
              <div className="rounded-md bg-muted px-2 py-2">
                <p className="text-lg font-semibold">{jobQuery.data.failedRows}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
              <div className="rounded-md bg-muted px-2 py-2">
                <p className="text-lg font-semibold">{formatLanguageName(jobQuery.data.language)}</p>
                <p className="text-xs text-muted-foreground">Default</p>
              </div>
            </div>
          </div>
        ) : null}

        {jobQuery.isError ? (
          <div className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {getErrorMessage(jobQuery.error)}
          </div>
        ) : null}

        {rows.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Results</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => void resultsQuery.refetch()}>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button size="sm" variant="secondary" onClick={() => exportResultsCsv(rows)}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            <div className="max-h-72 overflow-auto rounded-md border">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    <th className="p-3 font-semibold">Row</th>
                    <th className="p-3 font-semibold">Text</th>
                    <th className="p-3 font-semibold">Language</th>
                    <th className="p-3 font-semibold">Emotion</th>
                    <th className="p-3 text-right font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t bg-white">
                      <td className="p-3">{row.rowIndex + 1}</td>
                      <td className="max-w-sm truncate p-3">{row.inputText}</td>
                      <td className="p-3">{formatLanguageName(row.language)}</td>
                      <td className="p-3">
                        {row.predictedLabel ? `${row.emoji} ${row.displayLabel}` : row.errorMessage}
                      </td>
                      <td className="p-3 text-right tabular-nums">
                        {row.confidence !== null ? formatPercent(row.confidence) : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
