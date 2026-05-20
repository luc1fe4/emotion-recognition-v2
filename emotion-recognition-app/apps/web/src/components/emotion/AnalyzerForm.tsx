"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AnalysisResult, AnalyzeTextRequest } from "@emotion-recognition/shared";
import { analyzeTextRequestSchema, MAX_TEXT_LENGTH } from "@emotion-recognition/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2, Send, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { analyzeEmotion } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export function AnalyzerForm({
  onResult,
  onLoadingChange,
}: {
  onResult: (result: AnalysisResult) => void;
  onLoadingChange: (loading: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<AnalyzeTextRequest>({
    resolver: zodResolver(analyzeTextRequestSchema),
    defaultValues: {
      text: "",
      source: "web",
    },
  });

  const mutation = useMutation({
    mutationFn: (text: string) => analyzeEmotion(text),
    onMutate() {
      onLoadingChange(true);
    },
    onSuccess(result) {
      onResult(result);
      void queryClient.invalidateQueries({ queryKey: ["history"] });
    },
    onSettled() {
      onLoadingChange(false);
    },
  });

  const text = form.watch("text") ?? "";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Emotion Analyzer
            </CardTitle>
            <CardDescription>Vietnamese social text</CardDescription>
          </div>
          <span className="rounded-md border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {text.trim().length}/{MAX_TEXT_LENGTH}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values.text))}
        >
          <div className="space-y-2">
            <label htmlFor="emotion-text" className="text-sm font-semibold">
              Nội dung
            </label>
            <Textarea
              id="emotion-text"
              placeholder="hôm nay tôi rất vui 😊"
              maxLength={MAX_TEXT_LENGTH}
              disabled={mutation.isPending}
              {...form.register("text")}
            />
            {form.formState.errors.text ? (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {form.formState.errors.text.message}
              </p>
            ) : null}
          </div>

          {mutation.isError ? (
            <div className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {getErrorMessage(mutation.error)}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Analyze
            </Button>
            <Button type="button" variant="ghost" disabled={mutation.isPending} onClick={() => form.reset()}>
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
