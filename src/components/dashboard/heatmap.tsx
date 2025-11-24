"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function Heatmap() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get starting day of week (0 = Sunday)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days: (ContributionDay | null)[] = [];
    
    // Add empty placeholders for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Generate days
    for (let i = 1; i <= daysInMonth; i++) {
      // Random data generation (deterministic based on date for demo)
      const dateStr = `${year}-${month}-${i}`;
      // Simple hash for demo consistency
      const hash = dateStr.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
      const rand = Math.abs(hash % 100) / 100;
      
      let count = 0;
      if (rand > 0.6) count = Math.floor(rand * 5) + 1;
      if (rand > 0.85) count = Math.floor(rand * 10) + 5;
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count > 2) level = 2;
      if (count > 5) level = 3;
      if (count > 8) level = 4;

      days.push({
        date: new Date(year, month, i).toISOString().split('T')[0],
        count,
        level,
      });
    }

    // Fill remaining days of the last week to maintain grid shape
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        days.push(null);
      }
    }
    
    return days;
  }, [currentDate]);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-stone-100";
      case 1: return "bg-orange-200";
      case 2: return "bg-orange-300";
      case 3: return "bg-orange-400";
      case 4: return "bg-orange-500";
      default: return "bg-stone-100";
    }
  };

  const monthName = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg font-medium text-foreground">Heatmap</h3>
        <div className="flex items-center gap-1">
          <button 
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-black/5 text-(--accent-soft) transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium w-20 text-center tabular-nums">{monthName}</span>
          <button 
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-black/5 text-(--accent-soft) transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-(--accent-soft)/60">
              {day}
            </div>
          ))}
        </div>
          
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDate.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 gap-2"
          >
            {monthData.map((day, index) => (
              <div
                key={day ? day.date : `empty-${index}`}
                className="aspect-square relative group"
              >
                {day ? (
                  <>
                    <div 
                      className={`w-full h-full rounded-md ${getLevelColor(day.level)} transition-all duration-300 hover:scale-90 hover:opacity-90 cursor-default shadow-sm`}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-[10px] text-white shadow-xl group-hover:block z-10 pointer-events-none">
                      <div className="font-medium">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <div className="text-white/70">{day.count}h</div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full rounded-md bg-black/2" />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
