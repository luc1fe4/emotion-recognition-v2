"use client";

import type { AnalysisResult } from "@emotion-recognition/shared";
import { BarChart3, Gauge } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPercent } from "@/lib/utils";
import { ProbabilityChart } from "./ProbabilityChart";

export function EmotionResultCard({ result, isLoading }: { result?: AnalysisResult | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="min-h-[420px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            Kết quả
          </CardTitle>
          <CardDescription>Đang phân tích</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-28 animate-pulse rounded-md bg-muted" />
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="h-5 animate-pulse rounded-sm bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="min-h-[420px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Kết quả
          </CardTitle>
          <CardDescription>Chưa có dữ liệu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-72 items-center justify-center rounded-md border border-dashed bg-muted/45 p-6 text-center text-sm text-muted-foreground">
            Kết quả phân tích sẽ xuất hiện tại đây.
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedScores = [...result.scores].sort((a, b) => b.score - a.score);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl leading-none">{result.emoji}</span>
              {result.displayLabelVi}
            </CardTitle>
            <CardDescription>{result.predictedLabel}</CardDescription>
          </div>
          <Badge className="border-primary/20 bg-primary/10 text-primary">{formatPercent(result.confidence)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-md border bg-muted/35 p-4">
          <p className="line-clamp-4 text-sm leading-6 text-foreground">{result.inputText}</p>
        </div>

        <ProbabilityChart scores={result.scores} />

        <div className="space-y-3">
          {sortedScores.map((score) => (
            <div key={score.label} className="grid grid-cols-[minmax(94px,1fr)_minmax(120px,2fr)_48px] items-center gap-3">
              <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
                <span>{score.emoji}</span>
                <span className="truncate">{score.displayLabelVi}</span>
              </div>
              <Progress value={score.score * 100} />
              <span className="text-right text-sm tabular-nums text-muted-foreground">{formatPercent(score.score)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
