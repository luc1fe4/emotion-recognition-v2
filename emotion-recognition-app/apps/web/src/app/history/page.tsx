import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { HistoryPanel } from "@/components/emotion/HistoryPanel";
import { buttonVariants } from "@/components/ui/button";

export default function HistoryPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Emotion Recognition</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Lịch sử phân tích</h1>
          </div>
          <Link className={buttonVariants({ variant: "outline" })} href="/">
            <ArrowLeft className="h-4 w-4" />
            Analyzer
          </Link>
        </div>
        <HistoryPanel expanded />
      </div>
    </main>
  );
}
