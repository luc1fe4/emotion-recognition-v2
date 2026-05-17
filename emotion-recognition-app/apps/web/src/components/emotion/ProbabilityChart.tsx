"use client";

import type { ScoreItem } from "@emotion-recognition/shared";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const LABEL_COLORS: Record<string, string> = {
  Sadness: "#3b82f6",
  Surprise: "#f59e0b",
  Disgust: "#10b981",
  Fear: "#8b5cf6",
  Anger: "#ef4444",
  Other: "#64748b",
  Enjoyment: "#14b8a6",
};

export function ProbabilityChart({ scores }: { scores: ScoreItem[] }) {
  const data = scores.map((score) => ({
    name: score.displayLabelVi,
    label: score.label,
    value: Math.round(score.score * 1000) / 10,
    fill: LABEL_COLORS[score.label] ?? "#0f766e",
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" interval={0} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
          <Tooltip
            cursor={{ fill: "rgba(15, 118, 110, 0.08)" }}
            formatter={(value) => [`${value}%`, "Confidence"]}
            labelClassName="font-semibold"
            contentStyle={{ borderRadius: 8, borderColor: "#dbe3ea" }}
          />
          <Bar dataKey="value" radius={[6, 6, 2, 2]} isAnimationActive />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
