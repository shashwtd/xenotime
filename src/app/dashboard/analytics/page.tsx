"use client";

import { ActivityGraph } from "@/components/dashboard/activity-graph";
import { Heatmap } from "@/components/dashboard/heatmap";
import { Flame, Clock, TrendingUp } from "lucide-react";

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

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Total Focus Card - Lighter Style */}
        <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 text-(--accent-soft) mb-2">
            <div className="p-2 rounded-lg bg-(--accent)/5 text-(--accent)">
              <Clock size={20} />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider">Total Focus</span>
          </div>
          <div className="mt-2">
            <div className="font-variant-numeric text-4xl font-bold tracking-tight text-foreground">
              128
              <span className="text-xl text-(--accent-soft) ml-1 font-medium">h</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                <TrendingUp size={14} />
                +12%
              </span>
              <span className="text-(--accent-soft)">vs last month</span>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 text-(--accent-soft) mb-2">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-500">
              <Flame size={20} />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider">Current Streak</span>
          </div>
          <div className="mt-2">
            <div className="font-variant-numeric text-4xl font-bold tracking-tight text-foreground">
              12
              <span className="text-xl text-(--accent-soft) ml-1 font-medium">days</span>
            </div>
            <div className="mt-3 text-sm text-(--accent-soft)">
              Keep it up! You're on fire.
            </div>
          </div>
        </div>

        {/* Daily Average */}
        <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 text-(--accent-soft) mb-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider">Daily Average</span>
          </div>
          <div className="mt-2">
            <div className="font-variant-numeric text-4xl font-bold tracking-tight text-foreground">
              4.5
              <span className="text-xl text-(--accent-soft) ml-1 font-medium">h</span>
            </div>
            <div className="mt-3 text-sm text-(--accent-soft)">
              Consistent effort pays off.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Weekly Activity Graph */}
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Weekly Activity</h3>
          <div className="h-[300px] w-full">
            <ActivityGraph />
          </div>
        </div>

        {/* Yearly Heatmap */}
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Focus History</h3>
          <Heatmap />
        </div>
      </div>
    </div>
  );
}
