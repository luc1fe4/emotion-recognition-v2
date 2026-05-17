"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock3, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getHistory } from "@/lib/api";
import { formatPercent, formatTime, getErrorMessage } from "@/lib/utils";

export function HistoryPanel({ expanded = false }: { expanded?: boolean }) {
  const limit = expanded ? 50 : 8;
  const historyQuery = useQuery({
    queryKey: ["history", limit],
    queryFn: () => getHistory(limit),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-primary" />
              Lịch sử
            </CardTitle>
            <CardDescription>{expanded ? "Danh sách đầy đủ" : "Gần đây"}</CardDescription>
          </div>
          <Button
            aria-label="Refresh history"
            size="icon"
            variant="outline"
            onClick={() => void historyQuery.refetch()}
            disabled={historyQuery.isFetching}
          >
            <RefreshCw className={historyQuery.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {historyQuery.isError ? (
          <div className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {getErrorMessage(historyQuery.error)}
          </div>
        ) : null}

        {historyQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: expanded ? 8 : 4 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : null}

        {!historyQuery.isLoading && historyQuery.data?.items.length === 0 ? (
          <div className="rounded-md border border-dashed bg-muted/45 p-5 text-center text-sm text-muted-foreground">
            Chưa có lịch sử.
          </div>
        ) : null}

        <div className="space-y-3">
          {historyQuery.data?.items.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-md border bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg leading-none">{item.emoji}</span>
                  <span className="font-semibold">{item.displayLabelVi}</span>
                  <Badge>{formatPercent(item.confidence)}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.inputText}</p>
              </div>
              <time className="text-sm text-muted-foreground">{formatTime(item.createdAt)}</time>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
