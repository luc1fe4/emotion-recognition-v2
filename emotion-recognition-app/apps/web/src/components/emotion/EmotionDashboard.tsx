"use client";

import type { AnalysisResult } from "@emotion-recognition/shared";
import { Activity, BrainCircuit, Database, History } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AnalyzerForm } from "@/components/emotion/AnalyzerForm";
import { BatchUploadPanel } from "@/components/emotion/BatchUploadPanel";
import { EmotionResultCard } from "@/components/emotion/EmotionResultCard";
import { HistoryPanel } from "@/components/emotion/HistoryPanel";
import { buttonVariants } from "@/components/ui/button";

export function EmotionDashboard() {
  const [latestResult, setLatestResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Activity className="h-4 w-4" />
              Vietnamese Emotion Recognition
            </div>
            <h1 className="mt-2 max-w-3xl text-2xl font-semibold leading-tight sm:text-4xl">
              Analyze Vietnamese social media emotion
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link className={buttonVariants({ variant: "outline" })} href="/history">
              <History className="h-4 w-4" />
              History
            </Link>
            <a
              className={buttonVariants({ variant: "ghost" })}
              href="https://huggingface.co/tazuneru/baseline-phobert-vsmec-emotion-recognition"
              rel="noreferrer"
              target="_blank"
            >
              <BrainCircuit className="h-4 w-4" />
              Model
            </a>
          </nav>
        </header>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)]">
          <div className="space-y-5">
            <AnalyzerForm
              onLoadingChange={setIsAnalyzing}
              onResult={(result) => {
                setLatestResult(result);
              }}
            />
            <BatchUploadPanel />
          </div>

          <div className="space-y-5">
            <EmotionResultCard result={latestResult} isLoading={isAnalyzing} />
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] xl:grid-cols-1">
              <div className="rounded-lg border bg-card p-5 shadow-soft">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Runtime</h2>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md bg-muted p-3">
                    <dt className="text-muted-foreground">Frontend</dt>
                    <dd className="mt-1 font-semibold">Next.js</dd>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <dt className="text-muted-foreground">API</dt>
                    <dd className="mt-1 font-semibold">Express</dd>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <dt className="text-muted-foreground">Model</dt>
                    <dd className="mt-1 font-semibold">FastAPI</dd>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <dt className="text-muted-foreground">Database</dt>
                    <dd className="mt-1 font-semibold">PostgreSQL</dd>
                  </div>
                </dl>
              </div>
              <HistoryPanel />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
