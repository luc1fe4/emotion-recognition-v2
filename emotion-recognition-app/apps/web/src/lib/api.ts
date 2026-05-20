import type { AnalysisResult, BatchJob, BatchResult, HistoryItem } from "@emotion-recognition/shared";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers:
      init?.body instanceof FormData
        ? init.headers
        : {
            "Content-Type": "application/json",
            ...init?.headers,
          },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;

  if (!response.ok || !payload || payload.success === false) {
    throw new Error(
      payload && "message" in payload
        ? payload.message
        : "Không thể kết nối dịch vụ phân tích. Vui lòng thử lại.",
    );
  }

  return payload.data;
}

export function analyzeEmotion(text: string) {
  return apiFetch<AnalysisResult>("/api/emotions/analyze", {
    method: "POST",
    body: JSON.stringify({ text, source: "web" }),
  });
}

export type BatchUploadResult = BatchJob & {
  jobId?: string;
  queueMode?: "redis" | "synchronous";
};

export function uploadBatch(file: File) {
  const body = new FormData();
  body.append("file", file);

  return apiFetch<BatchUploadResult>("/api/emotions/batch", {
    method: "POST",
    body,
  });
}

export function getHistory(limit = 8) {
  return apiFetch<{ items: HistoryItem[]; nextCursor: string | null }>(`/api/emotions/history?limit=${limit}`);
}

export function getJob(jobId: string) {
  return apiFetch<BatchJob>(`/api/jobs/${jobId}`);
}

export function getJobResults(jobId: string) {
  return apiFetch<{ items: BatchResult[] }>(`/api/jobs/${jobId}/results`);
}

export function exportResultsCsv(rows: BatchResult[]) {
  const header = [
    "rowIndex",
    "inputText",
    "predictedLabel",
    "displayLabelVi",
    "emoji",
    "confidence",
    "errorMessage",
  ];

  const csv = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.rowIndex + 1,
        row.inputText,
        row.predictedLabel ?? "",
        row.displayLabelVi ?? "",
        row.emoji ?? "",
        row.confidence ?? "",
        row.errorMessage ?? "",
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `emotion-results-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
