"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function Heatmap() {
  // Generate mock data for the last 365 days
  const data = useMemo(() => {
    const days: ContributionDay[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Adjust to start on a Sunday to align the grid
    const startDay = oneYearAgo.getDay(); // 0 is Sunday
    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDay);

    // We need 52 weeks * 7 days = 364 days, plus a few to reach today
    // Let's just generate enough to fill the grid
    const totalDays = 53 * 7; 

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Random count with bias towards 0 (empty days)
      const rand = Math.random();
      let count = 0;
      if (rand > 0.7) count = Math.floor(Math.random() * 5) + 1; // 1-5 hours
      if (rand > 0.9) count = Math.floor(Math.random() * 10) + 5; // 5-15 hours
      
      // Determine level based on count
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count > 2) level = 2;
      if (count > 5) level = 3;
      if (count > 8) level = 4;

      days.push({
        date: currentDate.toISOString().split('T')[0],
        count,
        level,
      });
    }
    return days;
  }, []);

  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < data.length; i += 7) {
      weeksArray.push(data.slice(i, i + 7));
    }
    return weeksArray;
  }, [data]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-black/5";
      case 1: return "bg-(--accent)/20";
      case 2: return "bg-(--accent)/40";
      case 3: return "bg-(--accent)/70";
      case 4: return "bg-(--accent)";
      default: return "bg-black/5";
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[800px]">
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`h-3 w-3 rounded-sm ${getLevelColor(day.level)} transition-colors hover:ring-2 hover:ring-black/10 relative group`}
                  title={`${day.date}: ${day.count} hours`}
                >
                  {/* Simple Tooltip */}
                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white group-hover:block z-10">
                    {day.count} hours on {day.date}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-(--accent-soft)">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-black/5" />
            <div className="h-3 w-3 rounded-sm bg-(--accent)/20" />
            <div className="h-3 w-3 rounded-sm bg-(--accent)/40" />
            <div className="h-3 w-3 rounded-sm bg-(--accent)/70" />
            <div className="h-3 w-3 rounded-sm bg-(--accent)" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
