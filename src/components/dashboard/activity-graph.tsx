"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

type WeekPoint = { day: string; value: number; rawDate: Date };

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatRange = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

const makeHash = (value: string) =>
  value.split("").reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0);
    return acc & acc;
  }, 0);

const getStartOfWeek = (reference: Date, offset: number) => {
  const date = new Date(reference);
  const day = date.getDay();
  const mondayDiff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(mondayDiff - offset * 7);
  date.setHours(0, 0, 0, 0);
  return date;
};

const buildWeekData = (start: Date): WeekPoint[] =>
  WEEK_DAYS.map((label, idx) => {
    const date = new Date(start);
    date.setDate(start.getDate() + idx);
    const value = 90 + Math.abs(makeHash(date.toISOString()) % 210);
    return { day: label, value, rawDate: date };
  });

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-black px-3 py-2 shadow-xl">
        <p className="mb-0.5 text-xs font-medium text-white">{label}</p>
        <p className="text-sm font-bold text-white">
          {payload[0].value}{" "}
          <span className="font-normal text-white/60">min</span>
        </p>
      </div>
    );
  }
  return null;
};

export function ActivityGraph() {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekInfo = useMemo(() => {
    const today = new Date();
    const currentStart = getStartOfWeek(today, weekOffset);
    const weekData = buildWeekData(currentStart);
    const totalMinutes = weekData.reduce((sum, item) => sum + item.value, 0);

    const prevStart = new Date(currentStart);
    prevStart.setDate(currentStart.getDate() - 7);
    const prevData = buildWeekData(prevStart);
    const prevTotal = prevData.reduce((sum, item) => sum + item.value, 0);

    const percentChange = prevTotal
      ? Math.round(((totalMinutes - prevTotal) / prevTotal) * 100)
      : 0;

    const end = new Date(currentStart);
    end.setDate(currentStart.getDate() + 6);

    return {
      data: weekData,
      totalMinutes,
      percentChange,
      rangeLabel: `${formatRange(currentStart)} – ${formatRange(end)}`,
    };
  }, [weekOffset]);

  const handlePrevWeek = () => setWeekOffset((prev) => prev + 1);
  const handleNextWeek = () => setWeekOffset((prev) => Math.max(0, prev - 1));
  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-xl font-medium text-foreground">Weekly Activity</h3>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              {weekInfo.percentChange >= 0 ? "+" : ""}
              {weekInfo.percentChange}% vs last week
            </span>
          </div>
          <p className="text-sm text-(--accent-soft)">{weekInfo.rangeLabel}</p>
        </div>
        <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="text-xs font-medium text-(--accent-soft)">
            ~{Math.round(weekInfo.totalMinutes / 60)} hrs focused
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevWeek}
              className="rounded-full border border-black/10 p-2 text-(--accent-soft) transition-colors hover:border-black/30"
              aria-label="Previous week"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextWeek}
              disabled={isCurrentWeek}
              className={`rounded-full border p-2 transition-colors ${
                isCurrentWeek
                  ? "border-black/5 text-black/20"
                  : "border-black/10 text-(--accent-soft) hover:border-black/30"
              }`}
              aria-label="Next week"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-[200px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weekInfo.data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#f97316", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
