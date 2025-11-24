"use client";

import { ActivityGraph } from "@/components/dashboard/activity-graph";
import { Heatmap } from "@/components/dashboard/heatmap";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-12 lg:py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-(--accent-soft)">
          Track your focus trends and consistency over time.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Activity Graph - Takes up 2 columns */}
        <div className="lg:col-span-2 rounded-3xl border border-black/5 bg-white p-8 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] h-[420px]">
          <ActivityGraph />
        </div>

        {/* Monthly Heatmap - Takes up 1 column */}
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] h-[420px]">
          <Heatmap />
        </div>
      </div>
    </div>
  );
}
