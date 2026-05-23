"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AnalysisResult, AnalyzeTextRequest, SupportedLanguage } from "@emotion-recognition/shared";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_LABELS,
  MAX_TEXT_LENGTH,
  SUPPORTED_LANGUAGES,
  analyzeTextRequestSchema,
} from "@emotion-recognition/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Globe2, Loader2, Send, Sparkles } from "lucide-react";
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
      language: DEFAULT_LANGUAGE,
      source: "web",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: AnalyzeTextRequest) => analyzeEmotion(values.text, values.language),
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
  const language = form.watch("language") ?? DEFAULT_LANGUAGE;
  const placeholder =
    language === "en" ? "I am so happy today" : "h\u00f4m nay t\u00f4i r\u1ea5t vui \ud83d\ude0a";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Emotion Analyzer
            </CardTitle>
            <CardDescription>Vietnamese and English social text</CardDescription>
          </div>
          <span className="rounded-md border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {text.trim().length}/{MAX_TEXT_LENGTH}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Globe2 className="h-4 w-4 text-primary" />
              Language
            </span>
            <div className="grid grid-cols-2 gap-2 rounded-md border bg-muted p-1">
              {SUPPORTED_LANGUAGES.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={language === option ? "default" : "ghost"}
                  onClick={() => form.setValue("language", option as SupportedLanguage, { shouldValidate: true })}
                >
                  {LANGUAGE_LABELS[option]}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="emotion-text" className="text-sm font-semibold">
              Text
            </label>
            <Textarea
              id="emotion-text"
              placeholder={placeholder}
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
